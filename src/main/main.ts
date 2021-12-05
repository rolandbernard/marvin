
import { argv } from 'process';

if (argv.includes('msg')) {
    import('main/msg');
} else {
    import('main/app');
}

