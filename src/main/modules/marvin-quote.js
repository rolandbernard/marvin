
import { clipboard } from "electron";

const quotes = [
    'Marvin: “I think you ought to know I’m feeling very depressed.”\nTrillian: “Well, we have something that may take your mind off it.”\nMarvin: “It won’t work, I have an exceptionally large mind.“',
    'Marvin: “I am at a rough estimate thirty billion times more intelligent than you. Let me give you an example. Think of a number, any number.”\nZem: “Er, five.”\nMarvin: “Wrong. You see?”',
    'Marvin: “You can blame the Sirius Cybernetics Corporation for making androids with GPP…”\nArthur: “Um… what’s GPP?”\nMarvin: “Genuine People Personalities. I’m a personality prototype. You can tell, can’t you…?”',
    'Arthur: I think that door just sighed.\nMarvin: Ghastly, isn’t it? All the doors on this spaceship have been programmed to have a cheery and sunny disposition.',
    '“Trillian is one of the least benightedly unintelligent life forms it has been my profound lack of pleasure not to be able to avoid meeting.” –Marvin',
    'Arthur: “Marvin, any ideas?”\nMarvin: “I have a million ideas. They all point to certain death.”',
    '“Pardon me for breathing, which I never do anyway so I don’t know why I bother to say it, oh God, I’m so depressed. Here’s another one of those self-satisfied doors. Life! Don’t talk to me about life.” –Marvin',
    '“I could calculate your chance of survival, but you won’t like it.” –Marvin',
    '“My capacity for happiness, you could fit into a matchbox without taking out the matches first” –Marvin',
    '[Discussing the police ship]\nMarvin: That ship hated me.\nFord: Ship? What happened to it? Do you know?\nMarvin: It hated me because I talked to it.\nFord: You talked to it? What do you mean you talked to it?\nMarvin: Simple. I got very bored and depressed, so I went and plugged myself into its external computer feed. I talked to the computer at great length and explained my view of the universe to it.\nFord: And what happened?\nMarvin: It committed suicide.',
    '“Funny,” Marvin intoned funereally, “how just when you think life can’t possibly get any worse it suddenly does.”',
    '“What’s up?” asked Ford.\n“I don’t know,” said Marvin, “I’ve never been there.”',
    '“The first ten million years were the worst. And the second ten million: they were the worst, too. The third ten million I didn’t enjoy at all. After that, I went into a bit of a decline. ” –Marvin',
    '“I’d give you advice, but you wouldn’t listen. No one ever does.” –Marvin',
    'Zaphod: “Can it Trillian, I’m trying to die with dignity.”\nMarvin: “I’m just trying to die.”',
    '“I’ve seen it. It’s rubbish.” –Marvin',
    '“Here I am, brain the size of a planet and they ask me to take you down to the bridge. Call that job satisfaction? ‘Cos I don’t.” –Marvin',
    '“I think you ought to know I’m feeling very depressed.” –Marvin',
    '“Not that anyone cares what I say, but the Restaurant is on the other end of the universe.” –Marvin',
    '“I’m not getting you down at all am I” –Marvin',
    'Trillian: Marvin… you saved our lives!\nMarvin: I know. Wretched, isn’t it?',
    'Marvin: “And then of course I’ve got this terrible pain in all the diodes down my left side.”\nArthur: “Is that so?”\nMarvin: “Oh yes. I mean I’ve asked for them to be replaced, but no one ever listens.”\nArthur: “I can imagine”',
    '“Now the world has gone to bed\nDarkness won’t engulf my head\nI can see by infra-red\nHow I hate the night\nNow I lay me down to sleep\nTry to count electric sheep\nSweet dream wishes you can keep\nHow I hate the night” –Marvin',
    '“You watch this door. It’s about to open again. I can tell by the intolerable air of smugness it suddenly generates.” –Marvin',
    '“Let’s build robots with Genuine People Personalities,’ they said. So they tried it out with me. I’m a personality prototype. You can tell, can’t you?” –Marvin',
    'Zaphod Beeblebrox: Into the interior of the planet. That is where we have to go. Down into the very depths of time itself where no man has trod these five million years. We are not gonna be great. We are not gonna be amazing. We are gonna be amazingly amazing!\nMarvin: Sounds awful.\nZaphod Beeblebrox: Can it, Marvin.\nMarvin: Life. Loathe it or ignore it. You can’t like it.',
    '“Do you want me to sit in a corner and rust, or just fall apart where I’m standing?” –Marvin',
    'Arthur: I lived on a beautiful planet once.\nMarvin: Did it have oceans?\nArthur: Oh yes; great big rolling oceans.\nMarvin: I hate oceans.',
    '“It’s the people you meet in this job that really get you down.” –Marvin',
    'Marvin: I’ve been talking to the main computer.\nArthur: And?\nMarvin: It hates me.',
    '“Hardly worth anyone’s while to help a menial robot, is it ?… I mean, where’s the percentage in being kind or helpful to a robot if it doesn’t have any gratitude circuits?” –Marvin',
    '“I only have to talk to somebody and they begin to hate me. Even robots hate me. If you just ignore me I expect I shall probably go away.” –Marvin',
    '“This is the sort of thing you lifeforms enjoy, is it?” –Marvin',
    'Marvin: [as they are gazing at the wonder of Magrathea] Incredible… it’s even worse than I thought it would be.',
    '“Don’t pretend you want to talk to me, I know you hate me.” –Marvin',
    '“The best conversation I had was over forty million years ago…. And that was with a coffee machine.” –Marvin',
    '“I’m quite used to being humiliated,” droned Marvin, “I can even go and stick my head in a bucket of water if you like. Would you like me to go and stick my head in a bucket of water? I’ve got one ready. Wait a minute.”\n“Er, hey, Marvin …” interrupted Zaphod, but it was too late. Sad little clunks and gurgles came up the line.\n“What’s he saying?” asked Trillian.\n“Nothing,” said Zaphod, “he just phoned to wash his head at us.”',
    '“Why should I want to make anything up? Life’s bad enough as it is without wanting to invent any more of it.” –Marvin',
    '“Wearily I sit here, pain and misery my only companions. Why stop now just when I’m hating it?” –Marvin',
    '“Well I wish you’d just tell me rather than try to engage my enthusiasm.” –Marvin',
    'Zaphod: There’s a whole new life stretching out in front of you.\nMarvin: Oh, not another one.',
    '“It gives me a headache just trying to think down to your level.” –Marvin',
    '“Reverse primary thrust, Marvin.” That’s what they say to me. “Open airlock number 3, Marvin.” “Marvin, can you pick up that piece of paper?” Here I am, brain the size of a planet, and they ask me to pick up a piece of paper.”',
    'Trillian: What are you supposed to do with a manically depressed robot?\nMarvin: You think you’ve got problems. What are you supposed to do if you are a manically depressed robot?',
    '“I won’t enjoy it.” –Marvin',
    'Marvin: [talking about the Ultimate Question to the Ultimate Answer to Life, the Universe and Everything] It’s printed in the Earthman’s brainwave patterns, but I don’t suppose you’d be interested in knowing that.\nArthur Dent: You mean you can see into my mind?\nMarvin: Yes.\nArthur Dent: Well?\nMarvin: It amazes me how you manage to live in anything that small.',
    '“Sounds awful.” –Marvin',
];

const MarvinQuoteModule = {
    valid: (query) => {
        return query === '';
    },
    search: async (query) => {
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        return [{ type: 'simple_text', text: quote, executable: true }];
    },
    execute: async (option) => {
        clipboard.writeText(option.text);
    },
}

export default MarvinQuoteModule;
