
const config = require('../config');

//.. gVar

function getGlobal(window, config) { 
    let _global_ = window || {}; 
    return Object.assign(_global_, { callback: () => {}, debugMode: config.debugMode}); 
}
export const Global = getGlobal(window, config); 

//===========================================
//.. Check for the Environment 
//===========================================
export function isDev() {
    return (!process.env.NODE_ENV) || ((process.env.NODE_ENV === 'development') && (Global.debugMode))  
}

//... quick-set for the debugging mode ::flashim
(function(Global){

    Global.addEventListener ("keydown", function (event) {
        if (event.shiftKey  &&  event.key === "D") {  // case sensitive
            Global.debugMode = false;
        }
        if (event.key === "d") {  // case sensitive
            Global.debugMode = true;
        }
    });
    Global.onerror = function(message, url, line, col, errorObj) {
        if(Global.debugMode){
            alert(`${message}\n${url}, ${line}:${col}} `);
        }
    };
})(Global)

