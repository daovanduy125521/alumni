
 const API_URL = 'https://localhost:44310/api';
 const API_LOGIN =API_URL+ '/Auth/SigninByCredential';
 const API_USERS = API_URL+ '/User';
 const API_GET_USER_BY_ID = 'https://localhost:44310'
 const API_ROLES = API_URL+ '/Role';
 const API_REGISTER = API_URL + "/Auth/Signup"
 const API_REFRESH_TOKEN = API_URL + "/Auth/RefreshToken"
 const API_LOGOUT = API_URL + "/Auth/Logout";
 const ICON_URL = "../../../assets/icons"
 const API_LOGIN_PASSWORD = API_URL + "/Auth/SigninByLoginModel"
 const API_IMPORT_USER = API_URL + '/Alumni/ImportExcelFile'
 const API_EXPORT_ERROR_USER = API_URL + '/Alumni/ExportExcelFile'
 const API_USER_SETTING = API_URL + '/User/Settings'
 const API_FORGOT_REQUEST = API_URL + '/User/ForgotPassword'
 const API_CHECK_FORGOT = API_URL + '/User/CheckTokenForgotPassword'
 const API_CHANGE_PASSWORD_FORGOT = API_URL + '/User/ChangePasswordByForgot'
 const API_CHANGE_PASSWORD = API_URL + "/User/ChangePasswordBySetting"
 const API_GET_ALL_FIELDS = API_URL + '/Manage/Field'
 const API_GET_ALUMNI_BY_STATUS = API_URL +  "/Manage/GetAlumniesByStatus";
 const API_UPDATE_USER_STATUS = API_URL + "/Manage/Alumni/ApproveStatus";
 const API_GETALL_ALUMNI = API_URL + "/Manage/Alumni"
 const API_ADD_WORK_EXPRIENCE = API_URL + "/User/Settings/WorkExperience";
 const API_ADD_EDUCATION_EXPRIENCE = API_URL + "/User/Settings/EducationExperience";
 const API_GET_ALL_STAFF = API_URL + '/Manage/Staff';
 const API_FIND_ALUMNI_TAG = API_URL + '/Alumni/FindALumniForTag';
 const API_CREATE_POST = API_URL + '/Post'
 const API_VIEW_POST_IN_GROUP = API_URL + '/Post/ViewPostInGroup';
 const API_VIEW_POST_IN_PROFILE = API_URL + '/Post/ViewPostInUserProfile'
 const API_COMMENT = API_URL + '/Comment'
 const API_GET_PAGE_COMMENT = API_URL + '/Comment/GetPageOfCommentsByPostId';
 const API_GET_ALL_POST_FIELD = API_URL + '/Filed'
 const API_GET_ALL_POST_MAJOR = API_URL + '/Tag'
 const API_GET_ALL_POST_CATEGORY = API_URL + '/PostCategory';
 const API_GET_COMMENT_BY_POSTID = API_URL +'/GetPageOfCommentsByPostId';
 const API_CREATEMENTEE = API_URL + '/Mentoring/BecomeAMentee';
 const API_CREATEMENTOR = API_URL + '/Mentoring/BecomeAMentor';
 const API_FILTERMENTORS = API_URL + '/Mentoring/FilterMentors';
 const API_MENTOR_DETAIL = API_URL + '/Mentoring';
 const API_MENTOR_REPORT = API_URL + '/Mentoring/Report';
 const ICONS = ['success_circle', 'error_circle', 'info_circle', 'warning_circle', 'excel', 'download', 'employee', 'dashboard', 'alumni', 'add', 'check_list', 'warning', 'menu', 'close',
  'down', 'mail', 'phone', 'facebook', 'more', 'search', 'edit', 'linkedin', 'public', 'lock', 'image', 'zoom_in', 'zoom_out', 'image_off', 'camera', 'delete', 'a_symbol', 'like', 'chat',
  'eye', 'eye_off', 'send'
 ];
 const COMMENT_PAGE_SIZE = 8;
 export enum AccountStatus{
  UNAUTHORIZE = "UNAUTHORIZE",
  ACTIVATED = "ACTIVATED",
  INACTIVATED = "INACTIVATED",
  DELETED = "DELETED"
 }

 export enum Role {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  ALUMNI = 'ALUMNI'
}

export {API_URL, API_LOGIN, API_ROLES, API_USERS, API_REGISTER, API_REFRESH_TOKEN, API_GET_USER_BY_ID, ICON_URL, ICONS, API_LOGIN_PASSWORD,
  API_IMPORT_USER, API_USER_SETTING, API_FORGOT_REQUEST, API_CHECK_FORGOT, API_CHANGE_PASSWORD_FORGOT, API_GET_ALL_FIELDS, API_EXPORT_ERROR_USER, API_GET_ALUMNI_BY_STATUS
, API_UPDATE_USER_STATUS, API_GETALL_ALUMNI, API_ADD_WORK_EXPRIENCE, API_ADD_EDUCATION_EXPRIENCE, API_CHANGE_PASSWORD, API_LOGOUT, API_GET_ALL_STAFF, API_FIND_ALUMNI_TAG,
API_CREATE_POST, API_COMMENT, API_GET_PAGE_COMMENT, API_GET_ALL_POST_FIELD, API_GET_ALL_POST_MAJOR, API_GET_ALL_POST_CATEGORY, API_VIEW_POST_IN_GROUP, API_GET_COMMENT_BY_POSTID,
COMMENT_PAGE_SIZE, API_VIEW_POST_IN_PROFILE, API_CREATEMENTEE, API_FILTERMENTORS, API_MENTOR_DETAIL,   API_MENTOR_REPORT, API_CREATEMENTOR}



