/*!
 * Preformatted text dialog plugin for Editor.md
 *
 * @file        preformatted-text-dialog.js
 * @author      pandao
 * @version     1.2.0
 * @updateTime  2015-03-07
 * {@link       https://github.com/pandao/editor.md}
 * @license     MIT
 */
!function(){var e=function(e){var t;e.fn.preformattedTextDialog=function(){var o,i=this.cm,n=this.lang,r=this.editor,a=this.settings,d=i.getCursor(),l=i.getSelection(),s=this.classPrefix,c=n.dialog.preformattedText,f=s+"preformatted-text-dialog";if(i.focus(),r.find("."+f).length>0)(o=r.find("."+f)).find("textarea").val(l),this.dialogShowMask(o),this.dialogLockScreen(),o.show();else{var h='<textarea placeholder="coding now...." style="display:none;">'+l+"</textarea>";o=this.createDialog({name:f,title:c.title,width:780,height:540,mask:a.dialogShowMask,drag:a.dialogDraggable,content:h,lockScreen:a.dialogLockScreen,maskStyle:{opacity:a.dialogMaskOpacity,backgroundColor:a.dialogMaskBgColor},buttons:{enter:[n.buttons.enter,function(){var e=this.find("textarea").val();if(""===e)return alert(c.emptyAlert),!1;for(var t in e=e.split("\n"))e[t]="    "+e[t];return e=e.join("\n"),0!==d.ch&&(e="\r\n\r\n"+e),i.replaceSelection(e),this.hide().lockScreen(!1).hideMask(),!1}],cancel:[n.buttons.cancel,function(){return this.hide().lockScreen(!1).hideMask(),!1}]}})}var g={mode:"text/html",theme:a.theme,tabSize:4,autofocus:!0,autoCloseTags:!0,indentUnit:4,lineNumbers:!0,lineWrapping:!0,extraKeys:{"Ctrl-Q":function(e){e.foldCode(e.getCursor())}},foldGutter:!0,gutters:["CodeMirror-linenumbers","CodeMirror-foldgutter"],matchBrackets:!0,indentWithTabs:!0,styleActiveLine:!0,styleSelectedText:!0,autoCloseBrackets:!0,showTrailingSpace:!0,highlightSelectionMatches:!0},u=o.find("textarea");o.find(".CodeMirror");o.find(".CodeMirror").length<1?(t=e.$CodeMirror.fromTextArea(u[0],g),o.find(".CodeMirror").css({float:"none",margin:"0 0 5px",border:"1px solid #ddd",fontSize:a.fontSize,width:"100%",height:"410px"}),t.on("change",(function(e){u.val(e.getValue())}))):t.setValue(i.getSelection())}};"function"==typeof require&&"object"==typeof exports&&"object"==typeof module?module.exports=e:"function"==typeof define?define.amd?define(["editormd"],(function(t){e(t)})):define((function(t){var o=t("./../../editormd");e(o)})):e(window.editormd)}();