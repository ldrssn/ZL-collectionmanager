export interface AppUpdate {
    id: string;
    title: string;
    message: string;
    buttonText: string;
    date: string; // Added date for sorting and display
}

export const APP_UPDATES: AppUpdate[] = [
    {
        id: '2026-04-24-filter-and-gallery-update-v1',
        title: '🚀 Filter und Gallery Update!',
        message: 'Folgende neuen Features und Updates gibts jetzt:\n\n**🏞️ GALLERIE**\nIch habe heute mehrere Fotos für dich: Zu Kombinationen können jetzt mehrere Bilder in eine Gallerie hochgeladen werden. Wähle dabei das Beste Foto für das Kachel-Bild aus.\n\n**💪 FILTER**\nFilter für Alle! aktviere mehrere Filter gleichzeitig. Außerdem wird dir direkt angezeigt, was du so aktuell filterst. Ach ja: Kombinationen werden nun endlich auch beim Form Filter berücksichtigt 🎉.\n\n**🙆 VERSCHIEDENES**\n# die **Standard-Ansicht** ist enthält jetzt nur die Teile und Kombinationeon, die in deiner aktiven Sammlung sind. Die anderen Ansichten kannst du natürlich jederzeit wieder aktivieren.\n# die **Suchfunktion** hat ein kleines touch-up bekommen und funktioniert nun so, wie die anderen Filter auch.',
        buttonText: 'Prima!',
        date: '2026-14-24'
    },
    {
        id: '2026-01-27-card-redesign-image-crop-v1',
        title: '🚀 Fancy Update!',
        message: 'Folgende neuen Features und Updates gibts jetzt:\n\n- **🎨 Card-Design**: Das karten Design wurde überarbeitet und vereinheitlicht. Inkl. Indikator, ob es eine Kombi oder ein einzelnes Item ist.\n- **💗 Quick-Wear**: Mit einem Tap auf den Wear-Counter (das Herzl) kannst du schnell ein Ausführen deines Schatzes dokumentieren.\n- **🌁  Bildbearbeitung**: Du kannst jetzt die Bilder zoomen und zurechtschneiden - für den perfekten Ausschnitt. Und einen Hintergrund auswählen, falls das Bild zu klein ist (weiß oder beige).',
        buttonText: 'Prima!',
        date: '2026-01-27'
    }, {
        id: '2026-01-26-new-mini-form-v1',
        title: 'App goes Mini!',
        message: 'Jetzt auch "Mini" als Form verfügbar:\n\n- **Kollektion**: Mini Klappen und Körper können jetzt erfasst werden.\n- Inkl. Eklusivitäts-Logik im Kombi-Creator',
        buttonText: 'Prima!',
        date: '2026-01-26'
    }, {
        id: '2026-01-26-notification-feature-v1',
        title: 'Notifications sind da!',
        message: 'Du wirst jetzt über neue Features und Updates per In-App Notification informiert.\n\n- **PopUp**: Beim Laden der App wird dir das letzte update angezeigt.\n- **History**: In deinem Profil kannst du dir den Verlauf der App-Updates anschaun, wenn du magst.',
        buttonText: 'Prima!',
        date: '2026-01-26'
    }
];
