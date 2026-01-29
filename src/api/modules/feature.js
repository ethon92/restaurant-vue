import service from '../index';

const favoriteApi = {
    createFavorite(data){
        return service({
            url: '/favorite',
            method: 'post',
            data
        })
    },
    favoriteList(userId){
        return service({
            url: `/favorite/${userId}`,
            method: 'get'
        })
    }
}

const commentApi = {
    createComment(comment_data){
        return service({
            url:'/comments',
            method: 'post',
            data : comment_data
        })
    }
}

export const createFavorite = favoriteApi.createFavorite
export const favoriteList = favoriteApi.favoriteList
export const createComment = commentApi.createComment
