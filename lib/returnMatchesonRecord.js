// returnMatchesonRecord function returns the matching lines to the vtexttomatch on the record for the fields provided
//  vtable, vsysid identify the glideRecord
//  vtexttomatch is the text to match (regex is accepted)
//  varray is  an array of field names 
//
function returnMatchesonRecord(vtable, vsysid, vtexttomatch, varray) {
    vtexttomatch = RegExp("^.*" + vtexttomatch + ".*$", "igm");
    vtable = new GlideRecord(vtable);
    vtable.get(vsysid);
    vsysid = [];
    for (var b = 0; b < varray.length; b++)
        if (vtable.getValue(varray[b])) {
            var f = (vtable.getValue(varray[b]) + "").match(vtexttomatch);
            f && vsysid.push("" + varray[b] + " matches: " + f.join(","))
        }
    return vsysid
};

// Example of use:
// gs.print('RESULTS: \n' + returnMatchesonRecord('sys_processor','0078cf30c3023000cef73b251eba8f1e','pdf',"script,name".split(",")).join('\n'));
//
// RESULTS
//  
//  *** Script: RESULTS: 
//  name matches: PDFProcessor