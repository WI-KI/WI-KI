/*!
 * Help dialog plugin for Editor.md
 *
 * @file        help-dialog.js
 * @author      pandao
 * @version     1.2.0
 * @updateTime  2015-03-08
 * {@link       https://github.com/pandao/editor.md}
 * @license     MIT
 */
!function(){var o=function(o){var e=jQuery;o.fn.helpDialog=function(){var i,t=this.lang,a=this.editor,d=this.settings,n=d.pluginPath+"help-dialog/",l=this.classPrefix+"help-dialog",r=t.dialog.help;if(a.find("."+l).length<1){i=this.createDialog({name:l,title:r.title,width:840,height:520,mask:d.dialogShowMask,drag:d.dialogDraggable,content:'<div class="markdown-body" style="font-family:微软雅黑, Helvetica, Tahoma, STXihei,Arial;height:390px;overflow:auto;font-size:14px;border-bottom:1px solid #ddd;padding:0 20px 20px 0;"></div>',lockScreen:d.dialogLockScreen,maskStyle:{opacity:d.dialogMaskOpacity,backgroundColor:d.dialogMaskBgColor},buttons:{close:[t.buttons.close,function(){return this.hide().lockScreen(!1).hideMask(),!1}]}})}i=a.find("."+l),this.dialogShowMask(i),this.dialogLockScreen(),i.show();var s=i.find(".markdown-body");""===s.html()&&e.get(n+"help.md",(function(e){var i=o.$marked(e);s.html(i),s.find("a").attr("target","_blank")}))}};"function"==typeof require&&"object"==typeof exports&&"object"==typeof module?module.exports=o:"function"==typeof define?define.amd?define(["editormd"],(function(e){o(e)})):define((function(e){var i=e("./../../editormd");o(i)})):o(window.editormd)}();