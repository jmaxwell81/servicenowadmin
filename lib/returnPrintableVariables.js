function returnPrintableVariables(vtable, vsysid) {
    var b = new GlideRecord(vtable),
        c = [];
    b.get(vsysid);
    if (b.isValid())
        for (key in b.variables) a = b.variables[key], "" != a.getGlideObject().getQuestion().getLabel() && c.push("Variable name: " + key + " (" + a.getGlideObject().getQuestion().getLabel() + ") = '" + a.getDisplayValue() + "'");
    return c
}

// Example of usage:
// gs.print(returnPrintableVariables("sc_req_item", "a6dceaf0dbad8700c9e490b6db96197c").join("\n"));
//
// RETURNS:
// *** Script: Variable name: acrobat (Adobe Acrobat) = 'true'
// Variable name: photoshop (Adobe Photoshop) = 'false'
// Variable name: eclipse_ide (Eclipse IDE) = 'true'
// Variable name: Additional_software_requirements (Additional software requirements) = 'test here'
	
