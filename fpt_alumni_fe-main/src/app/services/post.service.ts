import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_COMMENT, API_CREATEMENTEE, API_CREATE_POST, API_FILTERMENTORS, API_FIND_ALUMNI_TAG, API_GET_ALL_POST_CATEGORY, API_GET_ALL_POST_FIELD, API_GET_ALL_POST_MAJOR, API_GET_COMMENT_BY_POSTID, API_GET_PAGE_COMMENT, API_MENTOR_DETAIL, API_MENTOR_REPORT, API_VIEW_POST_IN_GROUP, API_VIEW_POST_IN_PROFILE } from './const/const';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }



  getTagsByKeyword(keyword : string){
    return this.http.get(API_FIND_ALUMNI_TAG + "?keyWord="+keyword);
  }

  createUserPost(isPublic: boolean, content: string, userTagedId: string[], listImagePath: string[], category: string, fieldTags: string[], majorTags: string[]){
    let body = {
      title: "empty",
      content: content,
      isPublic : isPublic,
      categoryId: category,
      mediaInsertDTOs: listImagePath.map(imagePath => ({
        mediaUrl : imagePath
      })),
      userTagedIds: userTagedId,
      MajorTagIds: majorTags,
      filedIds: fieldTags
    }
    return this.http.post(API_CREATE_POST, body)
  }

  createPostInGroup(isPublic: boolean, content: string, userTagedId: string[], listImagePath: string[], category: string, fieldTags: string[], majorTags: string[]){
    let body = {
      title: "empty",
      content: content,
      isPublic : isPublic,
      categoryId: category,
      mediaInsertDTOs: listImagePath.map(imagePath => ({
        mediaUrl : imagePath
      })),
      userTagedIds: userTagedId,
      MajorTagIds: majorTags,
      filedIds: fieldTags,
       groupId: "1944dc6c-2913-4b5e-9653-8fe255b58d60"
    }
    console.log(body)
    return this.http.post(API_CREATE_POST, body)
  }

  getMyPost(usetId : string){
    return this.http.post(API_VIEW_POST_IN_PROFILE + `?ownId=${usetId}&currentPage=1&pageSize=8`,{})
  }

  getGroupPost(){
    const groupId = "1944dc6c-2913-4b5e-9653-8fe255b58d60";
    return this.http.post(API_VIEW_POST_IN_GROUP + `?groupId=${groupId}&currentPage=1&pageSize=9`,{})
  }

  createNewCommnet(content: string, postId: string){
    let body = {
      id: "",
      content: content,
      postId: postId
    }
    return this.http.post(API_COMMENT, body);
  }

  createNewCommentLevel2(content: string, postId: string, parrentCommentId: string){
    let body = {
      id: "",
      content: content,
      postId: postId,
      ParentCommentId: parrentCommentId
    }
    return this.http.post(API_COMMENT, body);
  }

  getPageCommentByPostId(postId : string, page: number, size: number) : Observable<any>{
    if(postId && page && size){
      return this.http.get(API_GET_PAGE_COMMENT + `/${postId}?pageNumber=${page}&pageSize=${size}`)
    }else{
      return of(null)
    }

  }
  getAllField(){
    return this.http.get(API_GET_ALL_POST_FIELD);
  }

  getAllMajor(){
    return this.http.get(API_GET_ALL_POST_MAJOR);
  }

  getAllPostCategory(){
    return this.http.get(API_GET_ALL_POST_CATEGORY);
  }

  deleteComment(commentId: string){
    return this.http.delete(API_COMMENT + `?id=${commentId}`)
  }

  updateComment(updatedComment: any){
    return this.http.put(API_COMMENT, updatedComment);
  }

  createMentee(body: any) {
    return this.http.post(API_CREATEMENTEE, body);
  }

  filterMentors(body: any) {
    return this.http.get(API_FILTERMENTORS, body);
  }
  
  getMentorDetail(usetId : string){
    return this.http.get(API_MENTOR_DETAIL + `/${usetId}`)
  }

  createMentorReport(body: any) {
    return this.http.post(API_MENTOR_REPORT, body);
  }
}
