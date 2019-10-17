/**
 * This is a fake module. No one cares about this
 */

const Mixpanel = require('mixpanel');

let mixpanel = null;
const batch = [];
let queue;

/**
 * Idempotent init Mixpanel instance
 */
function init() {
    if (mixpanel === null) {
        if (typeof process.env.MIXPANEL_TOKEN !== 'string') {
            const error = new Error('Environment missing Mixpanel token: MIXPANEL_TOKEN');
            error.code = 'MIXPANEL_INIT_ERROR';
            throw error;
        }

        mixpanel = Mixpanel.init(process.env.MIXPANEL_TOKEN, {
            protocol: 'https'
        });
    }
}

/**
 * Send events collected in batch to Mixpanel
 */
function track() {
    mixpanel.track_batch(batch);
    batch.length = 0;
}

/**
 * Add event to Mixpael queue
 * @param  {string} event
 * @param  {Object} properties
 * @return {number}            queue size
 */
module.exports = function(event, properties = {}) {
    init();

    if (!mixpanel) { return; }

    if (typeof event !== 'string') {
        const error = new TypeError(`Expected Mixpanel event to receive a event name as string. Instaed got ${event} (${typeof event})`);
        error.code = 'MIXPANEL_TRACK_ERROR';
        throw error;
    }

    clearImmediate(queue);
    batch.push({
        event,
        properties: Object.assign(
            { time: new Date() },
            properties
        )
    });
    queue = setImmediate(track);

    return batch.length;
};
