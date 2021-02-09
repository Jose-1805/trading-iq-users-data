let values = [];
let last_value = [];
let pending_operations = [];

function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
    if (!(maxBytesToWrite > 0)) return 0;

    var data = {};
    try{
        data = JSON.parse(str);
    }catch(error){
        //console.warn('ERROR', error)
    }

    try{
        let url = '';
        if(data.name){
            switch (data.name) {
                case 'candle-generated':
                case 'candles-generated':
                    //console.log(data.name, data);
                	break;
                //Opciones binarias en vivo
                case 'live-deal-binary-option-placed':
                    //console.log(data.msg.user_id+' - '+data.msg.name+' - '+data.msg.amount_enrolled+' - '+data.msg.direction+' - '+data.msg.expiration);
                	break;
                
                case 'api_option_init_all_result':
                	//console.log(data.name, data);
                	break;
                
                case 'profile':
                	//console.log(data.name, data);
                	break;
                
                case 'socket-option-opened':
                	//console.log(data.name, data);
                	break;
                
                case 'socket-option-closed':
                	//console.log(data.name, data);
                	break;
                
                case 'option-rejected':
                	//console.log(data.name, data);
                	break;
                
                case 'option':
                	//console.log(data.name, data);
                	break;
                
                case 'expiration-list-changed':
                	//console.log(data.name, data);
                	break;
                
                case 'digital-option-placed':
                	//console.log(data.name, data);
                	break;
                
                case 'order-changed':
                	//console.log(data.name, data);
                	break;
                
                case 'position-changed':
                	//console.log(data.name, data);
                	break;
                
                case 'history-positions':
                    //console.log(data.name, data);
                    break;

                default:
                	//console.log(data.name);
                    // statements_def
                    break;
            }
        }
    }catch(error){
        console.warn('ERROR', error)
    }

    var startIdx = outIdx;
    var endIdx = outIdx + maxBytesToWrite - 1;
    for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) {
            var u1 = str.charCodeAt(++i);
            u = 65536 + ((u & 1023) << 10) | u1 & 1023
        }
        if (u <= 127) {
            if (outIdx >= endIdx) break;
            outU8Array[outIdx++] = u
        } else if (u <= 2047) {
            if (outIdx + 1 >= endIdx) break;
            outU8Array[outIdx++] = 192 | u >> 6;
            outU8Array[outIdx++] = 128 | u & 63
        } else if (u <= 65535) {
            if (outIdx + 2 >= endIdx) break;
            outU8Array[outIdx++] = 224 | u >> 12;
            outU8Array[outIdx++] = 128 | u >> 6 & 63;
            outU8Array[outIdx++] = 128 | u & 63
        } else {
            if (outIdx + 3 >= endIdx) break;
            outU8Array[outIdx++] = 240 | u >> 18;
            outU8Array[outIdx++] = 128 | u >> 12 & 63;
            outU8Array[outIdx++] = 128 | u >> 6 & 63;
            outU8Array[outIdx++] = 128 | u & 63
        }
    }
    outU8Array[outIdx] = 0;
    return outIdx - startIdx
}