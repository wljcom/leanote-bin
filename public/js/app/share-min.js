Share.defaultNotebookId="share0";Share.defaultNotebookTitle=getMsg("defaulthhare");Share.sharedUserInfos={};Share.userNavs={};Share.notebookCache={};Share.cache={};Share.dialogIsNote=true;Share.setCache=function(note){if(!note||!note.NoteId){return}Share.cache[note.NoteId]=note};Share.getNotebooksForNew=function(userId,notebooks){var self=this;var navForNewNote="";var len=notebooks.length;for(var i=0;i<len;++i){var notebook=notebooks[i];notebook.IsShared=true;notebook.UserId=userId;self.notebookCache[notebook.NotebookId]=notebook;Notebook.cache[notebook.NotebookId]=notebook;var classes="";var subs=false;if(!isEmpty(notebook.Subs)){log(11);log(notebook.Subs);var subs=self.getNotebooksForNew(userId,notebook.Subs);if(subs){classes="dropdown-submenu"}}var eachForNew="";if(notebook.Perm){var eachForNew=tt('<li role="presentation" class="clearfix ?" userId="?" notebookId="?"><div class="new-note-left pull-left" title="为该笔记本新建笔记" href="#">?</div><div title="为该笔记本新建markdown笔记" class="new-note-right pull-left">M</div>',classes,userId,notebook.NotebookId,notebook.Title);if(subs){eachForNew+="<ul class='dropdown-menu'>";eachForNew+=subs;eachForNew+="</ul>"}eachForNew+="</li>"}navForNewNote+=eachForNew}return navForNewNote};Share.trees={};Share.renderShareNotebooks=function(sharedUserInfos,shareNotebooks){var self=Share;if(isEmpty(sharedUserInfos)){return}if(!shareNotebooks||typeof shareNotebooks!="object"||shareNotebooks.length<0){shareNotebooks={}}var $shareNotebooks=$("#shareNotebooks");for(var i in sharedUserInfos){var userInfo=sharedUserInfos[i];var userNotebooksPre=shareNotebooks[userInfo.UserId]||[];userNotebooks=[{NotebookId:self.defaultNotebookId,Title:Share.defaultNotebookTitle}].concat(userNotebooksPre);self.notebookCache[self.defaultNotebookId]=userNotebooks[0];var username=userInfo.Username||userInfo.Email;userInfo.Username=username;Share.sharedUserInfos[userInfo.UserId]=userInfo;var userId=userInfo.UserId;var header=tt('<li class="each-user"><div class="friend-header" fromUserId="?"><i class="fa fa-angle-down"></i><span>?</span> <span class="fa notebook-setting" title="setting"></span> </div>',userInfo.UserId,username);var friendId="friendContainer_"+userId;var body='<ul class="friend-notebooks ztree" id="'+friendId+'" fromUserId="'+userId+'"></ul>';$shareNotebooks.append(header+body+"</li>");self.trees[userId]=$.fn.zTree.init($("#"+friendId),Notebook.getTreeSetting(true,true),userNotebooks);self.userNavs[userId]={forNew:self.getNotebooksForNew(userId,userNotebooksPre)};log(self.userNavs)}$(".friend-notebooks").hover(function(){if(!$(this).hasClass("showIcon")){$(this).addClass("showIcon")}},function(){$(this).removeClass("showIcon")});$(".friend-header i").click(function(){var $this=$(this);var $tree=$(this).parent().next();if($tree.is(":hidden")){$tree.slideDown("fast");$this.removeClass("fa-angle-right fa-angle-down").addClass("fa-angle-down")}else{$tree.slideUp("fast");$this.removeClass("fa-angle-right fa-angle-down").addClass("fa-angle-right")}});var shareNotebookMenu={width:180,items:[{text:getMsg("deleteSharedNotebook"),icon:"",faIcon:"fa-trash-o",action:Share.deleteShareNotebook}],onShow:applyrule,onContextMenu:beforeContextMenu,parent:"#shareNotebooks",children:".notebook-item"};function applyrule(menu){return}function beforeContextMenu(){var notebookId=$(this).attr("notebookId");return!Share.isDefaultNotebookId(notebookId)}var menuNotebooks=$("#shareNotebooks").contextmenu(shareNotebookMenu);var shareUserMenu={width:180,items:[{text:getMsg("deleteAllShared"),icon:"",faIcon:"fa-trash-o",action:Share.deleteUserShareNoteAndNotebook}],parent:"#shareNotebooks",children:".friend-header"};var menuUser=$("#shareNotebooks").contextmenu(shareUserMenu);$(".friend-header").on("click",".notebook-setting",function(e){e.preventDefault();e.stopPropagation();var $p=$(this).parent();menuUser.showMenu(e,$p)});$("#shareNotebooks .notebook-item").on("click",".notebook-setting",function(e){e.preventDefault();e.stopPropagation();var $p=$(this).parent();menuNotebooks.showMenu(e,$p)})};Share.isDefaultNotebookId=function(notebookId){return Share.defaultNotebookId==notebookId};Share.toggleToSharedNav=function(userId,notebookId){var self=this;$("#curNotebookForListNote").html(Share.notebookCache[notebookId].Title+"("+Share.sharedUserInfos[userId].Username+")");var forNew=Share.userNavs[userId].forNew;if(forNew){$("#notebookNavForNewSharedNote").html(forNew);var curNotebookId="";var curNotebookTitle="";if(Share.notebookCache[notebookId].Perm){curNotebookId=notebookId;curNotebookTitle=Share.notebookCache[notebookId].Title}else{var $f=$("#notebookNavForNewSharedNote li").eq(0);curNotebookId=$f.attr("notebookId");curNotebookTitle=$f.find(".new-note-left").text()}$("#curNotebookForNewSharedNote").html(curNotebookTitle+"("+Share.sharedUserInfos[userId].Username+")");$("#curNotebookForNewSharedNote").attr("notebookId",curNotebookId);$("#curNotebookForNewSharedNote").attr("userId",userId);$("#newSharedNote").show();$("#newMyNote").hide()}else{$("#newMyNote").show();$("#newSharedNote").hide()}$("#tagSearch").hide()};Share.changeNotebook=function(userId,notebookId){Notebook.selectNotebook($(tt('#friendContainer_? a[notebookId="?"]',userId,notebookId)));Share.toggleToSharedNav(userId,notebookId);Note.curChangedSaveIt();Note.clearAll();var url="/share/ListShareNotes/";var param={userId:userId};if(!Share.isDefaultNotebookId(notebookId)){param.notebookId=notebookId}ajaxGet(url,param,function(ret){if(param.notebookId){}Note.renderNotes(ret,false,true);if(!isEmpty(ret)){Note.changeNote(ret[0].NoteId,true)}else{}})};Share.hasUpdatePerm=function(notebookId){var note=Share.cache[notebookId];if(!note||!note.Perm){return false}return true};Share.deleteShareNotebook=function(target){if(confirm("Are you sure to delete it?")){var notebookId=$(target).attr("notebookId");var fromUserId=$(target).closest(".friend-notebooks").attr("fromUserId");ajaxGet("/share/DeleteShareNotebookBySharedUser",{notebookId:notebookId,fromUserId:fromUserId},function(ret){if(ret){$(target).parent().remove()}})}};Share.deleteShareNote=function(target){var noteId=$(target).attr("noteId");var fromUserId=$(target).attr("fromUserId");ajaxGet("/share/DeleteShareNoteBySharedUser",{noteId:noteId,fromUserId:fromUserId},function(ret){if(ret){$(target).remove()}})};Share.deleteUserShareNoteAndNotebook=function(target){if(confirm("Are you sure to delete all shared notebooks and notes?")){var fromUserId=$(target).attr("fromUserId");ajaxGet("/share/deleteUserShareNoteAndNotebook",{fromUserId:fromUserId},function(ret){if(ret){$(target).parent().remove()}})}};Share.changeNotebookForNewNote=function(notebookId){Notebook.selectNotebook($(tt('#shareNotebooks [notebookId="?"]',notebookId)));var userId=Share.notebookCache[notebookId].UserId;Share.toggleToSharedNav(userId,notebookId);var url="/share/ListShareNotes/";var param={userId:userId,notebookId:notebookId};ajaxGet(url,param,function(ret){Note.renderNotes(ret,true,true)})};Share.deleteSharedNote=function(target,contextmenuItem){Note.deleteNote(target,contextmenuItem,true)};Share.copySharedNote=function(target,contextmenuItem){Note.copyNote(target,contextmenuItem,true)};Share.contextmenu=null;Share.initContextmenu=function(notebooksCopy){if(Share.contextmenu){Share.contextmenu.destroy()}var noteListMenu={width:180,items:[{text:getMsg("copyToMyNotebook"),alias:"copy",faIcon:"fa-copy",type:"group",width:180,items:notebooksCopy},{type:"splitLine"},{text:getMsg("delete"),alias:"delete",icon:"",faIcon:"fa-trash-o",action:Share.deleteSharedNote}],onShow:applyrule,parent:"#noteItemList",children:".item-shared"};function applyrule(menu){var noteId=$(this).attr("noteId");var note=Share.cache[noteId];if(!note){return}var items=[];if(!(note.Perm&&note.CreatedUserId==UserInfo.UserId)){items.push("delete")}menu.applyrule({name:"target...",disable:true,items:items})}Share.contextmenu=$("#noteItemList .item-shared").contextmenu(noteListMenu)};$(function(){$("#noteItemList").on("click",".item-shared .item-setting",function(e){e.preventDefault();e.stopPropagation();var $p=$(this).parent();Share.contextmenu.showMenu(e,$p)});$("#newSharedNoteBtn").click(function(){var notebookId=$("#curNotebookForNewSharedNote").attr("notebookId");var userId=$("#curNotebookForNewSharedNote").attr("userId");Note.newNote(notebookId,true,userId)});$("#newShareNoteMarkdownBtn").click(function(){var notebookId=$("#curNotebookForNewSharedNote").attr("notebookId");var userId=$("#curNotebookForNewSharedNote").attr("userId");Note.newNote(notebookId,true,userId,true)});$("#notebookNavForNewSharedNote").on("click","li div",function(){var notebookId=$(this).parent().attr("notebookId");var userId=$(this).parent().attr("userId");if($(this).text()=="M"){Note.newNote(notebookId,true,userId,true)}else{Note.newNote(notebookId,true,userId)}});$("#leanoteDialogRemote").on("click",".change-perm",function(){var self=this;var perm=$(this).attr("perm");var noteOrNotebookId=$(this).attr("noteOrNotebookId");var toUserId=$(this).attr("toUserId");var toHtml=getMsg("writable");var toPerm="1";if(perm=="1"){toHtml=getMsg("readOnly");toPerm="0"}var url="/share/UpdateShareNotebookPerm";var param={perm:toPerm,toUserId:toUserId};if(Share.dialogIsNote){url="/share/UpdateShareNotePerm";param.noteId=noteOrNotebookId}else{param.notebookId=noteOrNotebookId}ajaxGet(url,param,function(ret){if(ret){$(self).html(toHtml);$(self).attr("perm",toPerm)}})});$("#leanoteDialogRemote").on("click",".delete-share",function(){var self=this;var noteOrNotebookId=$(this).attr("noteOrNotebookId");var toUserId=$(this).attr("toUserId");var url="/share/DeleteShareNotebook";var param={toUserId:toUserId};if(Share.dialogIsNote){url="/share/DeleteShareNote";param.noteId=noteOrNotebookId}else{param.notebookId=noteOrNotebookId}ajaxGet(url,param,function(ret){if(ret){$(self).parent().parent().remove()}})});var seq=1;$("#leanoteDialogRemote").on("click","#addShareNotebookBtn",function(){seq++;var tpl='<tr id="tr'+seq+'"><td>#</td><td><input id="friendsEmail" type="text" class="form-control" style="width: 200px" placeholder="'+getMsg("friendEmail")+'"/></td>';tpl+='<td><label for="readPerm'+seq+'"><input type="radio" name="perm'+seq+'" checked="checked" value="0" id="readPerm'+seq+'"> '+getMsg("readOnly")+"</label>";tpl+=' <label for="writePerm'+seq+'"><input type="radio" name="perm'+seq+'" value="1" id="writePerm'+seq+'"> '+getMsg("writable")+"</label></td>";tpl+='<td><button class="btn btn-success" onclick="addShareNoteOrNotebook('+seq+')">'+getMsg("share")+"</button>";tpl+=' <button class="btn btn-warning" onclick="deleteShareNoteOrNotebook('+seq+')">'+getMsg("delete")+"</button>";tpl+="</td></tr>";$("#shareNotebookTable tbody").prepend(tpl);$("#tr"+seq+" #friendsEmail").focus()});$("#registerEmailBtn").click(function(){var content=$("#emailContent").val();var toEmail=$("#toEmail").val();if(!content){showAlert("#registerEmailMsg",getMsg("emailBodyRequired"),"danger");return}post("/user/sendRegisterEmail",{content:content,toEmail:toEmail},function(ret){showAlert("#registerEmailMsg",getMsg("sendSuccess"),"success");hideDialog2("#sendRegisterEmailDialog",1e3)},this)})});function addShareNoteOrNotebook(trSeq){var trId="#tr"+trSeq;var id=Share.dialogNoteOrNotebookId;var emails=isEmailFromInput(trId+" #friendsEmail","#shareMsg",getMsg("inputFriendEmail"));if(!emails){return}var shareNotePerm=$(trId+' input[name="perm'+trSeq+'"]:checked').val()||0;var perm=shareNotePerm;var url="share/addShareNote";var data={noteId:id,emails:[emails],perm:shareNotePerm};if(!Share.dialogIsNote){url="share/addShareNotebook";data={notebookId:id,emails:[emails],perm:shareNotePerm}}hideAlert("#shareMsg");post(url,data,function(ret){var ret=ret[emails];if(ret){if(ret.Ok){var tpl=tt("<td>?</td>","#");tpl+=tt("<td>?</td>",emails);tpl+=tt('<td><a href="#" noteOrNotebookId="?" perm="?" toUserId="?" title="'+getMsg("clickToChangePermission")+'" class="btn btn-default change-perm">?</a></td>',id,perm,ret.Id,!perm||perm=="0"?getMsg("readOnly"):getMsg("writable"));tpl+=tt('<td><a href="#" noteOrNotebookId="?" toUserId="?" class="btn btn-warning delete-share">'+getMsg("delete")+"</a></td>",id,ret.Id);$(trId).html(tpl)}else{var shareUrl=UrlPrefix+"/register?from="+UserInfo.Username;showAlert("#shareMsg",getMsg("friendNotExits",[getMsg("app"),shareUrl])+' <a id="shareCopy"  data-clipboard-target="copyDiv">'+getMsg("clickToCopy")+'</a> <span id="copyStatus"></span> <br /> '+getMsg("sendInviteEmailToYourFriend")+', <a href="#" onclick="sendRegisterEmail(\''+emails+"')\">"+getMsg("send"),"warning");$("#copyDiv").text(shareUrl);initCopy("shareCopy",function(args){if(args.text){showMsg2("#copyStatus",getMsg("copySuccess"),1e3)}else{showMsg2("#copyStatus",getMsg("copyFailed"),1e3)}})}}},trId+" .btn-success")}function sendRegisterEmail(email){showDialog2("#sendRegisterEmailDialog",{postShow:function(){$("#emailContent").val(getMsg("inviteEmailBody",[UserInfo.Username,getMsg("app")]));setTimeout(function(){$("#emailContent").focus()},500);$("#toEmail").val(email)}})}function deleteShareNoteOrNotebook(trSeq){$("#tr"+trSeq).remove()}