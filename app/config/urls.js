const baseUri = '/thirdpartyapi'
export default {
    fileUpload: baseUri + '/upload/uploadMultipartFile',
    getWxMedia: baseUri + '/thirdPartyUser/getMediaUrl',
    haveBindDoctor: baseUri + '/patientUser/haveBindDoctor',
    getQiniuToken: baseUri + '/upload/getToken',
    getSignature: 'http://hg-weixin.szyyky.com/thirdpartyapi/thirdPartyUser/getSignature',
}