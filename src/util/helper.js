export default {
    getTypeName: (type) => {
        switch (type) {
            case 1:
                return "单张";
            case 2:
                return "对子";
            case 3:
                return "三带一";
            case 4:
                return "三不带";
            case 5:
                return "四带二";
            case 6:
                return "顺子";
            case 7:
                return "连对";
            case 8:
                return "飞机不带";
            case 9:
                return "飞机";
            case 10:
                return "炸弹";
            case 11:
                return "王炸";
            default:
                return "未知";
        }
    },
    getUserLabel: (userId, lordUser) => {
        if (userId) {
            return `${userId} (${lordUser ? (userId === lordUser ? "地主" : "农民") : "未分配"})`;
        } else {
            return "未加入";
        }
    }
}