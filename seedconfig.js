import faker from "faker";
import utils from "./core/utils";

faker.locale = "id_ID";

export default {
    default_times: 100,
    entities: {
        User: {
            name: faker.name.findName,
            username: faker.internet.userName,
            password: {
                wrap: utils.hash,
                method: faker.internet.password
            }
        },
        Project: {
            name: faker.lorem.word,
            description: faker.lorem.paragraph,
            deadline: faker.date.future,
            user_id: () => 3
        }
    }
};