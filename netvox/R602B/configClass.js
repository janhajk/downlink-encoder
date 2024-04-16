import { LoRaWANConfigBase } from 'https://cdn.jsdelivr.net/gh/janhajk/downlink-encoder@v2.0.4/lib/base.js';

export default class R602B extends LoRaWANConfigBase {
    constructor(containerId) {

        const configurations = [{
                id: 'startWarningWithReq',
                title: 'Start Warning',
                function: (values) => {
                    const { mode, duration, ledIndication } = values;
                    const modeCodes = {
                        'Fire': '00',
                        'Emergency': '01',
                        'Burglar': '02',
                        'Doorbell': '03',
                        'Mute': '04'
                    };
                    const ledModes = {
                        'NoLedIndication': '00',
                        'LedBlinkMode1': '01',
                        'LedBlinkMode2': '02'
                    };
                    const ledMode = ledModes[ledIndication]; // Angenommen, 'ledIndication' ist nun ein Select-Feld mit den Werten 'NoLedIndication', 'LedBlinkMode1', 'LedBlinkMode2'
                    const durationHex = parseInt(duration).toString(16).padStart(4, '0').toUpperCase();
                    return `9069${modeCodes[mode]}${ledMode}${durationHex}0000000000`;
                },
                inputs: [
                    { id: 'mode', label: 'Alarm Mode', type: 'select', options: ['Fire', 'Emergency', 'Burglar', 'Doorbell', 'Mute'], default: 'Mute' },
                    { id: 'duration', label: 'Warning Duration (seconds)', type: 'number', default: 10 },
                    { id: 'ledIndication', label: 'LED Indication', type: 'select', options: ['NoLedIndication', 'LedBlinkMode1', 'LedBlinkMode2'], default: 'NoLedIndication' }
                ],
                checkboxes: []
            },
            {
                id: 'startWarningWithAckReq',
                title: 'Start Warning ACK',
                function: (values) => {
                    const { mode, duration, ledIndication } = values;
                    const modeCodes = {
                        'Fire': '00',
                        'Emergency': '01',
                        'Burglar': '02',
                        'Doorbell': '03',
                        'Mute': '04'
                    };
                    const ledModes = {
                        'NoLedIndication': '00',
                        'LedBlinkMode1': '01',
                        'LedBlinkMode2': '02'
                    };
                    const ledMode = ledModes[ledIndication]; // Angenommen, 'ledIndication' ist nun ein Select-Feld mit den Werten 'NoLedIndication', 'LedBlinkMode1', 'LedBlinkMode2'
                    const durationHex = parseInt(duration).toString(16).padStart(4, '0').toUpperCase();
                    return `0369${modeCodes[mode]}${ledMode}${durationHex}0000000000`;
                },
                inputs: [
                    { id: 'mode', label: 'Alarm Mode', type: 'select', options: ['Fire', 'Emergency', 'Burglar', 'Doorbell', 'Mute'], default: 'Mute' },
                    { id: 'duration', label: 'Warning Duration (seconds)', type: 'number', default: 10 },
                    { id: 'ledIndication', label: 'LED Indication', type: 'select', options: ['NoLedIndication', 'LedBlinkMode1', 'LedBlinkMode2'], default: 'NoLedIndication' }
                ],
                checkboxes: []
            },
            {
                id: 'configReportReq',
                title: 'Report Request',
                function: (values) => {
                    const { minTime, maxTime } = values;
                    const minTimeHex = parseInt(minTime).toString(16).padStart(4, '0').toUpperCase();
                    const maxTimeHex = parseInt(maxTime).toString(16).padStart(4, '0').toUpperCase();
                    return `016901${minTimeHex}${maxTimeHex}0000000000`;
                },
                inputs: [
                    { id: 'minTime', label: 'Minimum Time (seconds)', type: 'number', default: 300 },
                    { id: 'maxTime', label: 'Maximum Time (seconds)', type: 'number', default: 300 }
                ],
                checkboxes: []
            },
            {
                id: 'readConfigReportReq',
                title: 'Read Config Report Request',
                function: () => {
                    // This command seems to have no parameters and only a fixed payload
                    return `0269000000000000000000`;
                },
                inputs: [],
                checkboxes: []
            },
        ];

        super(containerId, configurations);

    }
}
