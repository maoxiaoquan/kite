var shell = require('shelljs');

class Shell {
    constructor() {

    }

    static demo() {
        let pm2_restart_code = shell.exec('pm2 restart kite')
        return pm2_restart_code.code
    }
}


module.exports = Shell
