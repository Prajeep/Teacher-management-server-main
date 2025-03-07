import config from "config";

export const getWelcomeMessage = (req: any, res: any) => {
    res.send(
        config.get("server.welcomeMessage") +
            ` - v${process.env.npm_package_version}`
    );
};
