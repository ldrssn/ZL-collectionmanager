export interface AppUpdate {
    id: string;
    title: string;
    message: string;
    buttonText: string;
    date: string; // Added date for sorting and display
}

export const APP_UPDATES: AppUpdate[] = [
    {
        id: '2024-01-26-new-mini-form-v1',
        title: 'App goes Mini!',
        message: 'Jetzt auch "Mini" als Form verfügbar:\n\n- **Kollektion**: Mini Klappen und Körper können jetzt erfasst werden.\n- Inkl. Eklusivitäts-Logik im Kombi-Creator',
        buttonText: 'Prima!',
        date: '2024-01-26'
    }, {
        id: '2024-01-26-notification-feature-v1',
        title: 'Notifications sind da!',
        message: 'Du wirst jetzt über neue Features und Updates per In-App Notification informiert.\n\n- **PopUp**: Beim Laden der App wird dir das letzte update angezeigt.\n- **History**: In deinem Profil kannst du dir den Verlauf der App-Updates anschaun, wenn du magst.',
        buttonText: 'Prima!',
        date: '2024-01-26'
    }
];
