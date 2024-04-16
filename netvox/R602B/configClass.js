import { LoRaWANConfigBase } from 'https://cdn.jsdelivr.net/gh/janhajk/downlink-encoder@v2.0.3/lib/base.js';

export default class R602B extends LoRaWANConfigBase {
    constructor(containerId) {

        const configurations = [{
                id: 'alarmMode',
                title: 'Alarm Mode Configuration',
                function: (values) => {
                    const { mode, duration, ledIndication } = values;
                    const modeCodes = {
                        'Fire': '00',
                        'Emergency': '01',
                        'Burglar': '02',
                        'Doorbell': '03',
                        'Mute': '04'
                    };
                    const ledMode = ledIndication ? '01' : '00'; // '01' for LED on, '00' for off
                    const durationHex = parseInt(duration).toString(16).padStart(4, '0').toUpperCase();
                    return `9069${modeCodes[mode]}${ledMode}${durationHex}0000000000`;
                },
                inputs: [
                    { id: 'mode', label: 'Alarm Mode', type: 'select', options: ['Fire', 'Emergency', 'Burglar', 'Doorbell', 'Mute'], default: 'Mute' },
                    { id: 'duration', label: 'Warning Duration (seconds)', type: 'number', default: 10 }
                ],
                checkboxes: [
                    { id: 'ledIndication', label: 'LED Indication', default: true }
                ]
            },
            {
                id: 'batteryStatus',
                title: 'Battery Status',
                function: (values) => {
                    const { reportInterval } = values;
                    const intervalHex = parseInt(reportInterval).toString(16).padStart(4, '0').toUpperCase();
                    return `016901${intervalHex}01690000000000`;
                },
                inputs: [
                    { id: 'reportInterval', label: 'Report Interval (seconds)', type: 'number', default: 3600 }
                ],
                checkboxes: []
            }
        ];

        super(containerId, configurations);

    }
}
