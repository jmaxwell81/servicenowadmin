searchnow("text_to_search","fastest"); // fastest search predefined tables 
// searchnow("text_to_search","fastestcustom");  // fastest search - only customised record
//  searchnow("text_to_search","minimalcustom"); // search based on most common tables - only customised record
//  searchnow("text_to_search","minimal"); // search based on most common tables
//  searchnow("text_to_search","fullcustom"); // search all tables - only customised record
//  searchnow("text_to_search","full"); // search all tables

function searchnow(vtexttosearch, vtypeofsearch) {
    if (!vtexttosearch) return "Nothing to search";
    var vblacklist = "syslog ar_sys_email sys_email var__m sys_upgrade_history_log ecc_queue alm_ asmt_ cmdb_ ecc_event live_ pa_ v_".split(" "),
        xfinallist = "cmn_map_page cmn_notif_message cmn_notif_service_provider cmn_relative_duration cmn_schedule_page cmn_timeline_page_style cmn_timeline_page content_block content_config content_link content_page_meta content_page_rule content_page content_site content_type_detail content_type contract_sla cxs_ui_config_base diagrammer_action discovery_classy discovery_port_probe discovery_probe_parameter discovery_probes ecc_agent_script_include ecc_agent_script_param ecc_agent_script expert_panel_transition kb_navons label live_table_notification map_filters metric_definition oauth_entity pa_breakdown_mappings pa_breakdown_relations pa_breakdowns pa_cubes pa_dimensions_acl pa_dimensions pa_indicators pa_scripts process_guide process_step_approval question risk_conditions sc_cat_item_delivery_plan sc_cat_item_delivery_task sc_cat_item_guide sc_cat_item sc_ic_aprvl_type_defn_staging sc_ic_aprvl_type_defn scheduled_data_import sn_appcreator_app_template sys_email_client_template sys_execution_tracker sys_filter_option_dynamic sys_gauge_counts sys_home sys_impex_entry sys_impex_map sys_installation_exit sys_nav_link sys_phone_format sys_phone_validate sys_process_flow sys_processor sys_progress_worker sys_script_ajax sys_script_client sys_script_email sys_script_fix sys_script_include sys_script sys_security_acl sys_service_api sys_sync_exclude sys_sync_history sys_sync_preview_remote sys_transform_entry sys_transform_map sys_trigger sys_ui_action sys_ui_context_menu sys_ui_list_script_client sys_ui_list_script_server sys_ui_macro sys_ui_ng_action sys_ui_overview_help_panel sys_ui_page sys_ui_policy sys_ui_script sys_update_version sys_update_xml sys_web_service sys_widgets sys_wizard_answer sysauto sysevent_email_action sysevent_email_template sysevent_in_email_action sysevent_script_action syslog_app_scope sysrule_approvals sysrule_assignment sysrule_escalate test_execution ts_table usageanalytics_count_cfg user_criteria wf_condition_default wf_condition wf_element_activity wf_workflow_version sys_properties sso_properties saml2_update1_properties sys_dictionary".split(" "),
        b = 20,
        c = !0,
        d = 9E3;
    vtypeofsearch && ("full" == vtypeofsearch ? (b = null, c = !1, xfinallist = vblacklist = d = null) : "fullcustom" == vtypeofsearch ? (b = null, c = !0, xfinallist = vblacklist = d = null) : "minimal" == vtypeofsearch ? (b = 20, c = !1, d = null) : "minimalcustom" == vtypeofsearch ? (b = 20, c = !0, d = null) : "fastest" == vtypeofsearch ? (b = 20, c = !1, d = null) : "fastestcustom" == vtypeofsearch && (b = 20, c = !0, d = null));
    vtexttosearch && gs.print(searchoninstance(vtexttosearch, b, c, d, vblacklist, xfinallist).join("\n"))
}

function searchoninstance(strSearch, Searchlimit, showcustomerupdateonly, vmaxtablesize, vblacklist, vfinallist) {
    strSearch.split(",");
    d = [];
    var u = [],
        a = new GlideRecord("sys_dictionary");
    a.addEncodedQuery("elementINaction_script,script,name,condition,server_script,client_script,timeline_page,gauge_page,login_page,detail_page,parent_page,content_page,search_page,condition_class,results_per_page,value_script,post_processor_script,transition_script,before_script,message,oauth_api_script,calculation,attributes,conditions,rejection_script,approval_script,ui_page,script_values,entitlement_script,delivery_plan_script,generation_script,condition_script,validator,approver_script,script_output,post_script,pre_script,old_browser_create_page,body,script_reference_id,script_reference_table,text,text_script,url_script,messages,api_name,payload,source_script,job_context,on_show_script,xml,html,script_false,script_true,script_name,message_text,message_html,script_artifact,script_artifact_table,assignment_script,event_name,output_process_script,processing_script,value^internal_type.nameINcomposite_name,compressed,conditions,condition_string,html,html_script,script,script_plain,short_table_name,string,string_full_utf8,sysevent_name,table_name,translated_field,translated_html,translated_text,user_roles,variable_conditions,xml");
    vblacklist && a.addEncodedQuery("^nameNOT LIKE" + vblacklist.join("^nameNOT LIKE"));
    vfinallist && a.addEncodedQuery("^nameIN" + vfinallist.join(","));
    a.orderBy("name");
    a.query();
    for (var b = {}; a.next();) b[a.name] ? 0 > b[a.name].searchField.indexOf(a.element + "") && (b[a.name].searchField = b[a.name].searchField + "," + a.element + "") : (b[a.name] = {}, b[a.name].name = a.name + "", b[a.name].searchField = a.element + "");
    for (var g in b)(new GlideRecord("sys_db_object")).get("name", b[g].name) || d.push("**Removing extra table: " + g) && b.splice(g,
        1);
    d.push("\nHere are the tables and fields searched:\n" + JSON.stringify(b));
    d.push("***Scripts***");
    for (g in b) {
        var h = b[g],
            a = h.name,
            r = "-",
            n = [],
            p = [],
            searchfield = b[g].searchField; 
            - 1 < g.indexOf("EXTRA") && (a = g.substring(g.indexOf("EXTRA") + 5));
        if (vmaxtablesize && getcount(a) > vmaxtablesize) d.push("*** Skipped table: " + a + " exceeded max records " + vmaxtablesize);
        else {
            var e = new GlideRecord(a);
            try {
                if (e.isValid()) {
                    for (var t = h.searchField.split(","), q = 0; q < t.length; q++) n.push(t[q] + "LIKE" + strSearch);
                    n && (e.addEncodedQuery(n.join("^OR")), r += "*** addEncodedQuery(" +
                        n.join("^OR") + ")\n");
                    showcustomerupdateonly && e.isValidField("sys_customer_update") && e.addQuery("sys_customer_update", "true");
                    Searchlimit && e.setLimit(Searchlimit);
                    e.query();
                    if (e.hasNext())
                        for (d.push("\n\n=====" + h.name + " (" + a + ")====="), d.push("Field(s): " + searchfield + "\n" + r), h = 1; e.next();) 
                            p.push(e.sys_id + ""), d.push("(" + h++ + ") " + e.getDisplayValue() + " - " + returnMatchesonRecord(a, e.sys_id, strSearch ,searchfield.split(",")).join('//') + "\n-- " + gs.getProperty("glide.servlet.uri") + a + ".do?sys_id=" + e.sys_id + "\n");
                    p.length && d.push("\nFinal link: " + gs.getProperty("glide.servlet.uri") + a + "_list.do?sysparm_query=sys_idIN" +
                        p.join(",") + " ")
                }
            } catch (v) {
                u.push(v)
            }
        }
    }
    return d
}

function getcount(vtable, vencodedquery) {
    try {
        var showcustomerupdateonly = new GlideAggregate(vtable);
        return showcustomerupdateonly.isValid() ? (vencodedquery && showcustomerupdateonly.addEncodedQuery(vencodedquery), showcustomerupdateonly.addAggregate("COUNT"), showcustomerupdateonly.query(), showcustomerupdateonly.next() ? c = showcustomerupdateonly.getAggregate("COUNT") : 0) : 0
    } catch (vmaxtablesize) {
        return 0
    }
};

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