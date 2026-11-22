import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'md9oxzrq',
    dataset: 'production',
  },
  // Hosted Studio address: https://simon-alla.sanity.studio
  studioHost: 'simon-alla',
  deployment: {
    appId: 'zcya5f6e3di4z49g10nt7n9q',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: false,
  },
})
