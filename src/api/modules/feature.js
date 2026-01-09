import service from '../index';

const favoriteApi = {
    createFavorite(data){
        return service({
            url: '/favorite',
            method: 'post',
            data
        })
    }
}

export const createFavorite = favoriteApi.createFavorite