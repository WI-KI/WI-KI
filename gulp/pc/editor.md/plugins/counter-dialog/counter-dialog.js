!function(){var e=function(e){var t=jQuery,n={"zh-cn":{dialog:{counterDlg:{title:"文章信息"}}}};e.fn.counterDialog=function(){var e,o=this.cm,i=this.editor,a=this.settings,l=(a.path,this.classPrefix+"counter-dialog");t.extend(!0,this.lang,n[this.lang.name]);var r=this.lang.dialog.counterDlg,d=['<div class="editormd-form" id="counter-container" style="padding: 0px 0;height: 63px;overflow: hidden;overflow-y: auto;">',"</div>"].join("\n");if(i.find("."+l).length>0)(e=i.find("."+l)).show();else{e=this.createDialog({name:l,title:r.title,width:260,height:145,mask:!1,drag:!1,closed:!1,content:d,lockScreen:!1,footer:!1,buttons:!1});var c=function(){var n=t(".fa-th-large").offset(),o=n.left-e.width();o<0&&(o=0),e.css({top:n.top+26+"px",left:o+"px"})};c(),t(window).resize(c),t(document).mouseup((function(e){0==t(e.target).parents("."+l).length&&t("."+l).hide()}))}var f=o.getValue(),s=(f.length,(f=(f=(f=(f=f.replace(/(^\s*)|(\s*$)/gi,"")).replace(/[ ]{2,}/gi," ")).replace(/\n /,"\n")).split(" ")).length,f.join("").length),g="",h="",u=t.proxy(a.ongetObjDocument,this)(),p=t.proxy(a.ongetObjCommon,this)();if(null!=u&&null!=p){var m=new Date(u.DateCreated);g=p.ToLocalDateString(m,!1)+" "+p.ToLocalTimeString(m);var v=new Date(u.DateModified);h=p.ToLocalDateString(v,!1)+" "+p.ToLocalTimeString(v)}var b=['<label">文章字数：'+s,"</label><br/>",'<label">创建时间：'+g,"</label><br/>",'<label">修改时间：'+h,"</label><br/>"].join("\n");t("#counter-container").html(b)}};"function"==typeof require&&"object"==typeof exports&&"object"==typeof module?module.exports=e:"function"==typeof define?define.amd?define(["editormd"],(function(t){e(t)})):define((function(t){var n=t("./../../editormd");e(n)})):e(window.editormd)}();