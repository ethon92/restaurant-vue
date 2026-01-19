import service from "../index"

const commentApi = {
    createComment(comment_data){
        return service({
            url:'/comments',
            method: 'post',
            data : comment_data
        })
    }
}
export const createComment = commentApi.createComment