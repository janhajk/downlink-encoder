import { LoRaWANConfigBase } from 'https://cdn.jsdelivr.net/gh/janhajk/downlink-encoder@v2.0.4/lib/base.js';

export default class Elsys extends LoRaWANConfigBase {
    constructor(containerId) {

        const configurations = [{
            id: 'deviceConfig',
            title: 'Device Configuration',
            function: (values) => {
                // Sammelt die Payload für jede Einstellung, wenn sie nicht leer ist
                const payloads = [];

                for (const setting of values.settings) {
                    if (setting.value) {
                        const valueHex = setting.value.replace(/-/g, '').toUpperCase();
                        const paddedValue = valueHex.padStart(setting.size * 2, '0'); // Stellt sicher, dass die Länge korrekt ist
                        payloads.push(`${setting.id}${paddedValue}`);
                    }
                }

                // Berechnet die Gesamtlänge der Payload
                const totalLength = payloads.reduce((acc, payload) => acc + payload.length / 2, 0);
                const totalLengthHex = totalLength.toString(16).padStart(2, '0').toUpperCase();

                // Kombiniert Header, Länge und Payloads
                return `3E${totalLengthHex}${payloads.join('')}`;
            },
            inputs: [
                // Dieses Array würde alle deine Einstellungen als Objekte enthalten
                {
                    settings: [
                        { id: '01', name: 'AppSKey', size: 16, value: '' }, // Beispielwert
                        { id: '02', name: 'NwkSKey', size: 16, value: '' }, // Beispielwert
                        // Füge hier weitere Einstellungen hinzu...
                    ]
                }
            ],
            checkboxes: []
        }];

        super(containerId, configurations);

    }
}
