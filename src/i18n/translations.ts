export type Language = 'es' | 'en' | 'fr';

export const translations = {
    es: {
        welcome: {
            title: "Super Duper Scrum Poker",
            subtitle: "Estimación ágil colaborativa",
            create: "Crear Sala",
            join: "Unirse a Sala",
            nameLabel: "Tu Nombre",
            namePlaceholder: "Ej. Ana, Juan...",
            sessionLabel: "ID de la Sala",
            sessionPlaceholder: "Ej. X7Y2Z9",
            startButton: "Comenzar Sesión",
            joinButton: "Entrar a la Sala",
            errorName: "Por favor ingresa tu nombre",
            errorSession: "Por favor ingresa un ID de sala"
        },
        game: {
            room: "Sala",
            exit: "Salir",
            average: "Promedio",
            deal: "¡Trato hecho!",
            agreed: "Todos de acuerdo en",
            votes: "votos",
            reveal: "Revelar Cartas",
            newRound: "Nueva Ronda",
            copy: "Copiar enlace"
        }
    },
    en: {
        welcome: {
            title: "Super Duper Scrum Poker",
            subtitle: "Collaborative Agile Estimation",
            create: "Create Room",
            join: "Join Room",
            nameLabel: "Your Name",
            namePlaceholder: "E.g. Anna, John...",
            sessionLabel: "Room ID",
            sessionPlaceholder: "E.g. X7Y2Z9",
            startButton: "Start Session",
            joinButton: "Enter Room",
            errorName: "Please enter your name",
            errorSession: "Please enter a room ID"
        },
        game: {
            room: "Room",
            exit: "Exit",
            average: "Average",
            deal: "Deal!",
            agreed: "Everyone agreed on",
            votes: "votes",
            reveal: "Reveal Cards",
            newRound: "New Round",
            copy: "Copy Link"
        }
    },
    fr: {
        welcome: {
            title: "Super Duper Scrum Poker",
            subtitle: "Estimation Agile Collaborative",
            create: "Créer une Salle",
            join: "Rejoindre une Salle",
            nameLabel: "Votre Nom",
            namePlaceholder: "Ex. Anne, Jean...",
            sessionLabel: "ID de la Salle",
            sessionPlaceholder: "Ex. X7Y2Z9",
            startButton: "Commencer la Session",
            joinButton: "Entrer dans la Salle",
            errorName: "Veuillez entrer votre nom",
            errorSession: "Veuillez entrer un ID de salle"
        },
        game: {
            room: "Salle",
            exit: "Quitter",
            average: "Moyenne",
            deal: "Marché conclu !",
            agreed: "Tout le monde est d'accord sur",
            votes: "votes",
            reveal: "Révéler les Cartes",
            newRound: "Nouvelle Manche",
            copy: "Copier le lien"
        }
    }
};
