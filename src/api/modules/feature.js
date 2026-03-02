import service from '../index';

// 收藏餐廳CRUD API
const favoriteApi = {
    createFavorite(data){
        return service({
            url: '/favorite',
            method: 'post',
            data
        })
    },
    getFavorite(userId, restaurantId){
        return service({
            url: `/favorite/${userId}/${restaurantId}`,
            method: 'get'
        })
    },
    favoriteList(userId){
        return service({
            url: `/favorite/${userId}`,
            method: 'get'
        })
    },
    updateFavorite(data) {
        return service({
            url: '/favorite',
            method: 'put',
            data
        })
    },
    deleteFavorite(favId) {
        return service({
            url: `/favorite/${favId}`,
            method: 'delete',
        })
    },
    deleteFavoriteRestaurant(userId, restaurantId) {
        return service({
            url: `/favorite/${userId}/${restaurantId}`,
            method: 'delete'
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
    },
    updateCommentStates(data) {
        return service({
            url: 'booking/comment-status',
            method: 'put',
            data
        })
    },
}

export const createFavorite = favoriteApi.createFavorite
export const favoriteList = favoriteApi.favoriteList
export const updateFavorite = favoriteApi.updateFavorite
export const deleteFavorite = favoriteApi.deleteFavorite
export const deleteFavoriteRestaurant = favoriteApi.deleteFavoriteRestaurant
export const getFavorite = favoriteApi.getFavorite
export const createComment = commentApi.createComment
export const updateCommentStates=commentApi.updateCommentStates