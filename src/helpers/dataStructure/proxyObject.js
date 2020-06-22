//@flow

const createProxyObject = (object: Object, defaultValue: any): ProxyObject<Object> => {
    return {
        get(value: ?string){
            return object[value] ? object[value] : defaultValue;
        }
    }
};

export default createProxyObject;
