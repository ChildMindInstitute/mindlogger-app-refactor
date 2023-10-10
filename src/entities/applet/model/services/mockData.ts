const activityData = {
  data: {
    result: {
      name: 'New Activity 1',
      description: '123123',
      splashScreen: '',
      image: '',
      showAllAtOnce: false,
      isSkippable: true,
      isReviewable: false,
      responseIsEditable: true,
      isHidden: false,
      scoresAndReports: null,
      subscaleSetting: null,
      reportIncludedItemName: null,
      id: 'activity_test_id',
      order: 1,
      items: [
        {
          question: 'test',
          responseType: 'slider',
          responseValues: {
            minLabel: '',
            maxLabel: '',
            minValue: 0,
            maxValue: 12,
            minImage: null,
            maxImage: null,
            scores: null,
            alerts: null,
          },
          config: {
            removeBackButton: false,
            skippableItem: false,
            addScores: false,
            setAlerts: false,
            additionalResponseOption: {
              textInputOption: false,
              textInputRequired: false,
            },
            showTickMarks: false,
            showTickLabels: false,
            continuousSlider: false,
            timer: 0,
          },
          name: 'Item1',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: true,
          id: 'af31676a-29ff-4516-944a-3893bab9cb9c',
        },
        {
          question: 'asdqweert',
          responseType: 'slider',
          responseValues: {
            minLabel: '',
            maxLabel: '',
            minValue: 1,
            maxValue: 5,
            minImage: null,
            maxImage: null,
            scores: null,
            alerts: null,
          },
          config: {
            removeBackButton: false,
            skippableItem: false,
            addScores: false,
            setAlerts: false,
            additionalResponseOption: {
              textInputOption: false,
              textInputRequired: false,
            },
            showTickMarks: false,
            showTickLabels: false,
            continuousSlider: false,
            timer: 0,
          },
          name: 'Item123',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: true,
          id: '472a5092-5246-4674-bbc8-39efb2394fe8',
        },
      ],
      createdAt: '2023-10-05T08:44:09.607210',
    },
  },
};

const appletDetails = {
  data: {
    result: {
      displayName: 'CSCZ Applet',
      description: '',
      about: '',
      image: '',
      watermark: '',
      themeId: 'b20b7931-c8c1-4891-b669-5f7f6aefa600',
      link: null,
      requireLogin: null,
      pinnedAt: null,
      retentionPeriod: null,
      retentionType: null,
      streamEnabled: false,
      reportServerIp: '',
      reportPublicKey: '',
      reportRecipients: [],
      reportIncludeUserId: false,
      reportIncludeCaseId: false,
      reportEmailBody: 'Please see the report attached to this email.',
      encryption: {
        publicKey:
          '[109,172,234,51,209,196,238,49,151,54,176,207,2,153,0,217,229,61,187,176,151,182,113,192,153,51,216,13,96,252,97,138,193,247,25,255,36,110,44,91,84,58,42,176,181,145,79,28,41,53,152,130,8,213,77,26,234,18,110,37,54,56,225,250,121,144,24,149,34,32,125,122,90,64,132,37,40,61,103,6,169,23,45,118,247,209,121,45,109,86,129,212,212,138,39,137,234,88,105,225,115,233,193,81,221,244,98,165,138,120,161,189,120,149,164,117,210,82,146,108,4,99,110,161,241,152,63,15]',
        prime:
          '[240,159,188,106,178,194,69,20,78,188,78,21,110,183,211,184,115,101,111,40,190,164,200,202,89,171,238,27,225,151,72,244,45,57,113,53,19,21,166,255,104,157,213,137,116,135,176,59,199,9,227,100,64,75,30,151,174,105,181,137,189,128,248,217,10,22,223,107,116,243,45,64,226,151,29,48,240,172,100,81,43,200,23,67,31,223,56,169,62,8,212,90,144,244,126,106,46,235,37,142,132,238,203,28,32,120,58,230,136,227,52,12,66,71,182,37,174,58,93,218,94,251,213,25,56,109,163,11]',
        base: '[2]',
        accountId: '66aec84a-7650-4ea7-b0fe-123fea7efd13',
      },
      id: 'applet_test_id',
      version: '1.1.0',
      createdAt: '2023-10-05T07:25:42.195711',
      updatedAt: '2023-10-05T07:25:42.195718',
      isPublished: false,
      activities: [
        {
          name: 'New Activity',
          description: '',
          splashScreen: '',
          image: '',
          showAllAtOnce: false,
          isSkippable: false,
          isReviewable: false,
          responseIsEditable: true,
          isHidden: false,
          scoresAndReports: {
            generateReport: false,
            showScoreSummary: false,
            reports: [],
          },
          subscaleSetting: null,
          reportIncludedItemName: null,
          id: 'applet_test_activity',
          order: 1,
          createdAt: '2023-10-05T07:25:42.255571',
        },
      ],
      activityFlows: [],
      theme: {
        name: 'CSCZ',
        logo: 'https://citizensciencezurich.files.wordpress.com/2021/09/cscz_logo_round.jpg',
        backgroundImage:
          'https://citizensciencezurich.files.wordpress.com/2021/09/cccs_app_background.jpg',
        primaryColor: '#c12528',
        secondaryColor: '#104770',
        tertiaryColor: '#fff',
        id: 'b20b7931-c8c1-4891-b669-5f7f6aefa600',
        public: true,
        allowRename: true,
      },
    },
    respondentMeta: {
      nickname: 'Dimitry Sakalouski',
    },
  },
};

const eventResponse = {
  data: {
    result: {
      appletId: '7a6b16dc-b134-48c0-a2a9-a61716214175',
      events: [
        {
          id: 'f87c398f-ace2-486a-b038-176366d97a18',
          entityId: '1a33864b-396f-4306-80c4-a3b5ad3dbd07',
          availability: {
            oneTimeCompletion: false,
            periodicityType: 'ALWAYS',
            timeFrom: {
              hours: 0,
              minutes: 0,
            },
            timeTo: {
              hours: 0,
              minutes: 0,
            },
            allowAccessBeforeFromTime: null,
            startDate: null,
            endDate: null,
          },
          selectedDate: '2023-09-06',
          timers: {
            timer: {
              hours: 0,
              minutes: 1,
            },
            idleTimer: null,
          },
          availabilityType: 'AlwaysAvailable',
          notificationSettings: null,
        },
        {
          id: 'fb479f7e-b59f-4d3e-b70d-3f749827e3b5',
          entityId: 'fccd4247-d9f4-4899-976a-1c2ba187436a',
          availability: {
            oneTimeCompletion: false,
            periodicityType: 'ALWAYS',
            timeFrom: {
              hours: 0,
              minutes: 0,
            },
            timeTo: {
              hours: 0,
              minutes: 0,
            },
            allowAccessBeforeFromTime: null,
            startDate: null,
            endDate: null,
          },
          selectedDate: '2023-09-06',
          timers: {
            timer: {
              hours: 0,
              minutes: 1,
            },
            idleTimer: null,
          },
          availabilityType: 'AlwaysAvailable',
          notificationSettings: null,
        },
        {
          id: '5d4aa09e-0003-4a00-96c3-c40e66eea869',
          entityId: '20a3db37-c8d9-4ded-80e8-55d13aeefc60',
          availability: {
            oneTimeCompletion: false,
            periodicityType: 'ALWAYS',
            timeFrom: {
              hours: 0,
              minutes: 0,
            },
            timeTo: {
              hours: 0,
              minutes: 0,
            },
            allowAccessBeforeFromTime: null,
            startDate: null,
            endDate: null,
          },
          selectedDate: '2023-09-06',
          timers: {
            timer: {
              hours: 0,
              minutes: 1,
            },
            idleTimer: null,
          },
          availabilityType: 'AlwaysAvailable',
          notificationSettings: null,
        },
      ],
    },
  },
};

const applets = {
  data: {
    result: [
      {
        displayName: 'CSCZ Applet',
        description: '',
        about: '',
        image: '',
        watermark: '',
        themeId: 'b20b7931-c8c1-4891-b669-5f7f6aefa600',
        link: null,
        requireLogin: null,
        pinnedAt: null,
        retentionPeriod: null,
        retentionType: null,
        streamEnabled: false,
        reportServerIp: '',
        reportPublicKey: '',
        reportRecipients: [],
        reportIncludeUserId: false,
        reportIncludeCaseId: false,
        reportEmailBody: 'Please see the report attached to this email.',
        encryption: {
          publicKey:
            '[109,172,234,51,209,196,238,49,151,54,176,207,2,153,0,217,229,61,187,176,151,182,113,192,153,51,216,13,96,252,97,138,193,247,25,255,36,110,44,91,84,58,42,176,181,145,79,28,41,53,152,130,8,213,77,26,234,18,110,37,54,56,225,250,121,144,24,149,34,32,125,122,90,64,132,37,40,61,103,6,169,23,45,118,247,209,121,45,109,86,129,212,212,138,39,137,234,88,105,225,115,233,193,81,221,244,98,165,138,120,161,189,120,149,164,117,210,82,146,108,4,99,110,161,241,152,63,15]',
          prime:
            '[240,159,188,106,178,194,69,20,78,188,78,21,110,183,211,184,115,101,111,40,190,164,200,202,89,171,238,27,225,151,72,244,45,57,113,53,19,21,166,255,104,157,213,137,116,135,176,59,199,9,227,100,64,75,30,151,174,105,181,137,189,128,248,217,10,22,223,107,116,243,45,64,226,151,29,48,240,172,100,81,43,200,23,67,31,223,56,169,62,8,212,90,144,244,126,106,46,235,37,142,132,238,203,28,32,120,58,230,136,227,52,12,66,71,182,37,174,58,93,218,94,251,213,25,56,109,163,11]',
          base: '[2]',
          accountId: '66aec84a-7650-4ea7-b0fe-123fea7efd13',
        },
        id: '4827d481-37e5-40da-bb3e-35daf035b42f',
        version: '1.1.0',
        createdAt: '2023-10-05T07:25:42.195711',
        updatedAt: '2023-10-05T07:25:42.195718',
        isPublished: false,
        theme: {
          name: 'CSCZ',
          logo: 'https://citizensciencezurich.files.wordpress.com/2021/09/cscz_logo_round.jpg',
          backgroundImage:
            'https://citizensciencezurich.files.wordpress.com/2021/09/cccs_app_background.jpg',
          primaryColor: '#c12528',
          secondaryColor: '#104770',
          tertiaryColor: '#fff',
          id: 'b20b7931-c8c1-4891-b669-5f7f6aefa600',
          public: true,
          allowRename: true,
        },
      },
    ],
  },
};

export default {
  activityData,
  appletDetails,
  eventResponse,
  applets,
};
