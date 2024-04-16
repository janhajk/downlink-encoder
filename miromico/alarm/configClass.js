import { LoRaWANConfigBase } from 'https://cdn.jsdelivr.net/gh/janhajk/downlink-encoder@v2.0.12/lib/base.js';

export default class MiroDeviceConfig extends LoRaWANConfigBase {
    constructor(containerId) {
        const configurations = [{
                id: 'deviceConfig',
                title: 'Device Configuration',
                function: (values) => {
                    const { confirmedUplinks, dutyCycle, lorawanClass, buzzer, keepAliveInterval, numberOfLEDs, automaticResetTime } = values;
                    const flags = (
                        (confirmedUplinks ? 1 : 0) << 7 |
                        (dutyCycle ? 1 : 0) << 6 |
                        (lorawanClass === 'C' ? 1 : 0) << 5 |
                        (buzzer ? 1 : 0) << 4
                    ).toString(16).padStart(2, '0');
                    const keepAliveIntervalHex = keepAliveInterval.toString(16).padStart(4, '0');
                    const numberOfLEDsHex = numberOfLEDs.toString(16).padStart(2, '0');
                    const automaticResetTimeHex = automaticResetTime.toString(16).padStart(2, '0');

                    return `06 80 ${flags} ${keepAliveIntervalHex} ${numberOfLEDsHex} ${automaticResetTimeHex}`.toUpperCase().replace(/ /g, '');
                },
                inputs: [
                    { id: 'keepAliveInterval', label: 'Keep Alive Interval (minutes)', type: 'number', default: 10 },
                    { id: 'numberOfLEDs', label: 'Number of LEDs in ring', type: 'number', default: 16 },
                    { id: 'automaticResetTime', label: 'Automatic reset time (hours)', type: 'number', default: 1 },
                    { id: 'lorawanClass', label: 'LoRaWAN Class', options: ['A', 'C'], type: 'select', default: 'A' },
                ],
                checkboxes: [
                    { id: 'confirmedUplinks', label: 'Confirmed Uplinks', default: false },
                    { id: 'dutyCycle', label: 'Duty Cycle', default: false },
                    { id: 'buzzer', label: 'Buzzer', default: false }
                ]
            },
            {
                id: 'setScene',
                title: 'Set Scene',
                function: (values) => {
                    const { scene } = values;
                    return `02 81 ${scene.toString(16).padStart(2, '0')}`.toUpperCase().replace(/ /g, '');
                },
                inputs: [
                    { id: 'scene', label: 'Scene', type: 'number', default: 0 }
                ],
                checkboxes: []
            },
            {
                id: 'setBrightness',
                title: 'Set Brightness',
                function: (values) => {
                    const { brightness } = values;
                    return `02 82 ${brightness.toString(16).padStart(2, '0')}`.toUpperCase().replace(/ /g, '');
                },
                inputs: [
                    { id: 'brightness', label: 'Brightness', type: 'number', default: 128 }
                ],
                checkboxes: []
            },
            {
                id: 'setVolume',
                title: 'Set Volume',
                function: (values) => {
                    const { volume } = values;
                    return `02 85 ${volume.toString(16).padStart(2, '0')}`.toUpperCase().replace(/ /g, '');
                },
                inputs: [
                    { id: 'volume', label: 'Volume', type: 'select', options: { 0: 'Off', 1: 'Low', 2: 'Medium', 3: 'High' }, default: 3 }
                ],
                checkboxes: []
            },
            {
                id: 'configureSceneLED',
                title: 'Configure Scene (LED Only)',
                function: (values) => {
                    const { scene, red, green, blue, timeout } = values;
                    const redHex = red.toString(16).padStart(2, '0');
                    const greenHex = green.toString(16).padStart(2, '0');
                    const blueHex = blue.toString(16).padStart(2, '0');
                    const timeoutHex = timeout.toString(16).padStart(4, '0');

                    return `07 83 ${scene.toString(16).padStart(2, '0')} ${redHex} ${greenHex} ${blueHex} ${timeoutHex}`.toUpperCase().replace(/ /g, '');
                },
                inputs: [
                    { id: 'scene', label: 'Scene to configure', type: 'number', default: 1 },
                    { id: 'red', label: 'Red value', type: 'number', default: 255 },
                    { id: 'green', label: 'Green value', type: 'number', default: 154 },
                    { id: 'blue', label: 'Blue value', type: 'number', default: 0 },
                    { id: 'timeout', label: 'Timeout time of scene (minutes)', type: 'number', default: 10 }
                ],
                checkboxes: []
            },
            {
                id: 'configureSceneLEDBuzzer',
                title: 'Configure Scene (LED and Buzzer)',
                function: (values) => {
                    const { scene, red, green, blue, timeout, melody, repeat } = values;
                    const redHex = red.toString(16).padStart(2, '0');
                    const greenHex = green.toString(16).padStart(2, '0');
                    const blueHex = blue.toString(16).padStart(2, '0');
                    const timeoutHex = timeout.toString(16).padStart(4, '0');
                    const melodyHex = melody.toString(16).padStart(2, '0');
                    const repeatHex = (repeat ? 1 : 0).toString(16).padStart(2, '0');

                    return `09 84 ${scene.toString(16).padStart(2, '0')} ${redHex} ${greenHex} ${blueHex} ${timeoutHex} ${melodyHex} ${repeatHex}`.toUpperCase().replace(/ /g, '');
                },
                inputs: [
                    { id: 'scene', label: 'Scene to configure', type: 'number', default: 1 },
                    { id: 'red', label: 'Red value', type: 'number', default: 255 },
                    { id: 'green', label: 'Green value', type: 'number', default: 154 },
                    { id: 'blue', label: 'Blue value', type: 'number', default: 0 },
                    { id: 'timeout', label: 'Timeout time of scene (minutes)', type: 'number', default: 10 },
                    { id: 'melody', label: 'Melody', type: 'number', default: 3 },
                    { id: 'repeat', label: 'Repeat', type: 'checkbox', default: true }
                ],
                checkboxes: []
            }
        ];

        super(containerId, configurations);
    }
}
