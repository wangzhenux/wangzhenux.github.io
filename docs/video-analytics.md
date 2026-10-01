# Portfolio video analytics

The homepage film sends events to the existing Google Analytics 4 property,
measurement ID `G-MK7VQ4DMYC`. No new analytics service is needed.

| Event | Meaning |
| --- | --- |
| `video_open` | Someone opens the film from the preview or Watch my story link. |
| `video_start` | The full film actually starts playing. Pausing and resuming does not add another start. |
| `video_progress` | Playback crosses 10%, 25%, 50%, or 75%, once per viewing. `video_percent` identifies the milestone. Seeking past a milestone does not backfill it. |
| `video_complete` | Playback reaches the end, once per viewing. This does not prove every second was watched; a viewer can seek. |

The silent looping preview is excluded. Reopening the film or choosing Watch again
starts a new viewing. `video_source` distinguishes `preview`, `watch_button`, and
`replay`. Each event also includes the video title, URL, provider, duration, current
time, percentage, and whether the player is visible.

In Google Analytics, open the **Events** report and look for these event names.
Use **Total users** for distinct measured viewers and **Event count** for total
opens, starts, or completions (including repeat viewings). Realtime can confirm
incoming events; standard reports take time to process new data. Tracking starts
with this deployment and cannot recover earlier video activity. Ad blockers and
browser privacy settings can prevent measurement.

For a breakdown by viewing milestone or click location, add event-scoped custom
dimensions for `video_percent` and `video_source`, then use them in an Exploration.
The basic open/start/completion counts work without those custom dimensions.

References: [GA4 video event conventions](https://support.google.com/analytics/answer/9216061),
[viewing events](https://support.google.com/analytics/answer/9322688),
[custom event parameters](https://developers.google.com/analytics/devguides/collection/ga4/event-parameters).
