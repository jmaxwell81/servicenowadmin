// Supporting library to parse 
// parseBool
// parseInt
// parseFloat
// parse

var ParseGlideElement = Class.create();  
ParseGlideElement.prototype = {  
    initialize: function() {},  
    // Parse. Input: A glideElement object. Output: A cast of the field value into boolean, decimal, date_time or string based on field internalType  
    parse: function(a) {  
        if(a.nil())return null;  
        var b = a.getED().getInternalType();  
        return "boolean" == b ? this.parseBool(a) :  
            "integer" == b ? this.parseInt(a) :   
            "glide_date_time" == b ? new GlideDateTime(a) :   
            "string" == b ? a.toString() :  
            "decimal" == b ? this.parseFloat(a):   
            a  
    },  
    parseBool: function(a) {  
        return "boolean" == typeof a ? a : /^(true|1|yes|on)$/i.test(a)  
    },  
    parseInt: function(a) {  
        return a + 0  
    },  
    parseFloat: function(a) {  
        return a + 0  
    },  
    type: "ParseGlideElement"  
};  

//  Example of usage
//     var gr = new GlideRecord("u_test_record");  
//     gr.get('6f46dfb913e576005e915f7f3244b020'); // sys_id of the test created  
//       
//     var vstring = gr.u_string1;  
//     var vinteger = gr.u_integer;  
//     var vboolean = gr.u_truefalse;  
//       
//     gs.print("Test without explicitly casting fields: \n " + testGlideRecord(vstring, vinteger, vboolean).join('\n'));  
//       
//     var gpe = new ParseGlideElement();  
//     vstring = gpe.parse(gr.u_string1);  // casting to string based on the ED internaltype Same as gr.u_string1.toString()  
//     vinteger = gpe.parse(gr.u_integer); // casting to integer based on the ED internaltype. Same as gr.u_integer + 0  
//     vboolean = gpe.parse(gr.u_truefalse); // casting to boolean based on the ED internaltype  
//       
//     gs.print("Test explicitly casting fields: \n " + testGlideRecord(vstring, vinteger, vboolean).join('\n'));  
//       
//       
//     function testGlideRecord(vstring, vinteger, vboolean) {  
//         var message = [];  
//         message.push(  
//             '\nGlide record u_test_record.do?sys_id=6f46dfb913e576005e915f7f3244b020'  
//         );  
//       
//         // Example 1 - Expected cast to String  
//       
//         message.push("\n****** Example 1  - Expected cast to String ");  
//         message.push("gr.u_string1: " + vstring + " - typeof: " + typeof vstring);  
//         message.push("gr.u_string1.length: " + vstring.length + " - expected: 11");  
//       
//         // Example 2 - Expected cast to Integer  
//         message.push("\n****** Example 2 - Expected cast to Integer ");  
//         message.push("gr.u_integer: " + vinteger + " - typeof: " + typeof vinteger);  
//         message.push(vinteger + " === 77777 :" + (vinteger === 77777) + '- expected: true');  
//       
//         // Example 3 - Expected cast to Boolean  
//         message.push("\n****** Example 3 - Expected cast to boolean ");  
//         message.push("gr.u_truefalse: " + vboolean + " - typeof: " + typeof vboolean);  
//         message.push(vboolean + " === false :" + (vboolean === false) +  
//             '- expected: true');  
//       
//         return message;  
//     }  