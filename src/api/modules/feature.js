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

export const createFavorite = favoriteApi.createFavorite
export const favoriteList = favoriteApi.favoriteList