import pkg from '@microsoft/microsoft-graph-client';
const { Client } = pkg;
import axios from 'axios';
import qs from 'qs';

const clientId = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET';
const tenantId = 'YOUR_TENANT_ID';

const siteId = 'YOUR_SITE_ID';
const fileId = 'YOUR_FILE_ID';
const TOKEN_ENDPOINT = 'https://login.microsoftonline.com/' + tenantId + '/oauth2/v2.0/token';
const POST_DATA = {
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    scope: "https://graph.microsoft.com/.default"
}

const authProvider = async (done) => {
    const data = qs.stringify(POST_DATA);
    const config = {
        method: 'post',
        url: TOKEN_ENDPOINT,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Cookie: 'x-ms-gateway-slice=prod; stsservicecookie=ests'
        },
        data,
    };

    const authResponse = await axios(config)
        .then((res) => res.data)
        .catch((err) => console.error(err));

    const token = authResponse.access_token;
    await done(null, token);
};

const clientOptions = {
    defaultVersion: 'v1.0',
    authProvider
}

const msGraphClient = (() => {
    const client = Client.init({
        ...clientOptions
    });
    return client;
})();

const downloadItemByIdAndSiteId = async (fileId, siteId) => {
    const driveDetails = await getDriveBySiteId(siteId);
    const fileContent = await downloadItemBySiteIdAndDriveAndFileId(
        siteDetails.id,
        driveDetails.id,
        fileId
    );

    return fileContent;
};

const getDriveBySiteId = async (siteId) => {
    const drivesDetailsList = await msGraphClient
        .api(`/sites('${siteId}')/drives?$select=id, name, webUrl`)
        .get()
        .then((res) => res)
        .catch((err) => console.error(err));

    const driveDetailsList = drivesDetailsList.value.filter((drive) =>
        drive.webUrl.endsWith('Shared%20Documents')
    );

    return driveDetailsList[0];
};

const downloadItemBySiteIdAndDriveAndFileId = async (siteId, driveId, fileId) => {
    const fileResponse = await msGraphClient
        .api(`sites('${siteId}')/drives('${driveId}')/items('${fileId}')/content`)
        .getStream()
        .then((res) => res)
        .catch((err) => console.error(err));

    return fileResponse;
};


const basic = {
    home: async (req, res) => {
        const fileResponse = await downloadItemByIdAndSiteId(
            fileId,
            siteId);

        res.send(fileResponse);
    },
    second: (req, res) => {
        res.send("This is the second page");
    }
}

export default basic;