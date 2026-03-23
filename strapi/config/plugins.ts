import path from 'path';

export default ({env}) => {
    // Cloudflare integrations
    const cfKey = env("CF_ACCESS_KEY_ID");
    const cfSecret = env("CF_ACCESS_SECRET");
    const cfEndpoint = env("CF_ENDPOINT");
    const cfBucket = env("CF_BUCKET");
    const cfPublic = env("CF_PUBLIC_ACCESS_URL");

    let config = {};

    if(
        cfKey &&
        cfSecret &&
        cfEndpoint &&
        cfBucket
    ){
        const providerOptions = {
            accessKeyId: cfKey,
            secretAccessKey: cfSecret,
            /**
             * `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`
             */
            endpoint: cfEndpoint,
            params: {
                Bucket: cfBucket,
            },
            /**
             * Sets if all assets should be uploaded in the root dir regardless the strapi folder.
             * It is useful because strapi sets folder names with numbers, not by user's input folder name
             * By default it is false
             */
            pool: false,
        }
        if(cfPublic){
            /**
             * Set this Option to store the CDN URL of your files and not the R2 endpoint URL in your DB.
             * Can be used in Cloudflare R2 with Domain-Access or Public URL: https://pub-<YOUR_PULIC_BUCKET_ID>.r2.dev
             * This option is required to upload files larger than 5MB, and is highly recommended to be set.
             * Check the cloudflare docs for the setup: https://developers.cloudflare.com/r2/data-access/public-buckets/#enable-public-access-for-your-bucket
             */
            providerOptions["cloudflarePublicAccessUrl"] = cfPublic;
        }

        config = {
            provider: "strapi-provider-cloudflare-r2",
            providerOptions,
            actionOptions: {
                upload: {},
                uploadStream: {},
                delete: {},
            },
        }
    }
    
    return {
        upload: {
            config: {
                ...config,
                breakpoints: {
                    xlarge: 1920,
                    large: 1000,
                    medium: 750,
                    small: 500,
                    xsmall: 64
                },
            },
        },
        /// Uncomment to integrate the email provider with aws ses.
        // email: {
        //     config: {
        //         provider: path.resolve(__dirname, '..', 'src', 'extensions', 'email', 'providers', 'aws-ses'),
        //         providerOptions: {
        //             accessKeyId: env('SES_ACCESS_KEY_ID'),
        //             secretAccessKey: env('SES_ACCESS_SECRET'),
        //             region: env('AWS_SES_REGION', 'us-east-1'), // https://docs.aws.amazon.com/general/latest/gr/ses.html
        //         },
        //         settings: {
        //             defaultFrom: 'support@fairmedtravel.com',
        //             defaultReplyTo: 'support@fairmedtravel.com',
        //         },
        //     },
        // },
    }
};
