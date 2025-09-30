import { fetch } from "../../libs/helper"


export const getStaticPhrasesAPI = async (payload?: any): Promise<any> => {
    return fetch({
        url: '/StaticPhrases/GetAllStaticPhrases',
        method: "POST",
        data:payload
    });
};

export const AddUpdateStaticPhrasessAPI = async (payload): Promise<any> => {
    return fetch({
        url: '/StaticPhrases/AddUpdateStaticPhrases',
        method: "POST",
        data:payload
    });
};

