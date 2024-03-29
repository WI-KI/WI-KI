/*!
 * Link dialog plugin for Editor.md
 *
 * @file        link-dialog.js
 * @author      pandao
 * @version     1.2.1
 * @updateTime  2015-06-09
 * {@link       https://github.com/pandao/editor.md}
 * @license     MIT
 */
!function(){var t=function(t){t.fn.linkDialog=function(){var t,e=this.cm,i=this.editor,a=this.settings,l=e.getSelection(),n=this.lang,o=n.dialog.link,d=this.classPrefix,r=d+"link-dialog";if(e.focus(),i.find("."+r).length>0)(t=i.find("."+r)).find("[data-url]").val("http://"),t.find("[data-title]").val(l),this.dialogShowMask(t),this.dialogLockScreen(),t.show();else{var c='<div class="'+d+'form"><label>'+o.url+'</label><input type="text" value="http://" data-url /><br/><label>'+o.urlTitle+'</label><input type="text" value="'+l+'" data-title /><br/></div>';t=this.createDialog({title:o.title,width:380,height:211,content:c,mask:a.dialogShowMask,drag:a.dialogDraggable,lockScreen:a.dialogLockScreen,maskStyle:{opacity:a.dialogMaskOpacity,backgroundColor:a.dialogMaskBgColor},buttons:{enter:[n.buttons.enter,function(){var t=this.find("[data-url]").val(),i=this.find("[data-title]").val();if("http://"===t||""===t)return alert(o.urlEmpty),!1;var a="["+i+"]("+t+' "'+i+'")';return""==i&&(a="["+t+"]("+t+")"),e.replaceSelection(a),this.hide().lockScreen(!1).hideMask(),!1}],cancel:[n.buttons.cancel,function(){return this.hide().lockScreen(!1).hideMask(),!1}]}})}}};"function"==typeof require&&"object"==typeof exports&&"object"==typeof module?module.exports=t:"function"==typeof define?define.amd?define(["editormd"],(function(e){t(e)})):define((function(e){var i=e("./../../editormd");t(i)})):t(window.editormd)}();