import * as v from 'valibot'

const FileTypeSchema = v.picklist([
    'csv', 'djvu', 'doc', 'docm', 'docx', 'dot', 'dotm', 'dotx', 'dps', 'dpt',
    'epub', 'et', 'ett', 'fb2', 'fodp', 'fods', 'fodt', 'hml', 'htm', 'html',
    'hwp', 'hwpx', 'key', 'md', 'mht', 'mhtml', 'numbers', 'odg', 'odp', 'ods',
    'odt', 'otp', 'ots', 'ott', 'oxps', 'pages', 'pdf', 'pot', 'potm', 'potx',
    'pps', 'ppsm', 'ppsx', 'ppt', 'pptm', 'pptx', 'rtf', 'stw', 'sxc', 'sxi',
    'sxw', 'txt', 'vsdm', 'vsdx', 'vssm', 'vssx', 'vstm', 'vstx', 'wps', 'wpt',
    'xls', 'xlsb', 'xlsm', 'xlsx', 'xlt', 'xltm', 'xltx', 'xml', 'xps',
] as const)

const CommentGroupsSchema = v.pipe(
    v.object({
        edit: v.optional(v.union([
            v.array(v.string()),
            v.string(),
        ])),
        remove: v.optional(v.union([
            v.array(v.string()),
            v.string(),
        ])),
        view: v.optional(v.union([
            v.array(v.string()),
            v.string(),
        ])),
    }),
    v.metadata({ description: 'Defines the groups whose comments the user can edit, remove and/or view' }),
)

const PermissionsSchema = v.pipe(
    v.object({
        changeHistory: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Allows to display the Restore button when using the onRequestRestore event. Default: false. Deprecated since 5.5.', examples: [true] }))),
        chat: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the chat functionality is enabled in the document. Default: true', examples: [true] }))),
        comment: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the document can be commented or not. Default coincides with edit parameter.', examples: [true] }))),
        commentGroups: v.optional(CommentGroupsSchema),
        copy: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the content can be copied to the clipboard. Default: true', examples: [true] }))),
        deleteCommentAuthorOnly: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the user can delete only his/her comments. Default: false', examples: [true] }))),
        download: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the document can be downloaded or only viewed/edited online. Default: true', examples: [true] }))),
        edit: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the document can be edited or only viewed. Default: true', examples: [true] }))),
        editCommentAuthorOnly: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the user can edit only his/her comments. Default: false', examples: [true] }))),
        fillForms: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the forms can be filled. Default coincides with edit or review parameter.', examples: [true] }))),
        modifyContentControl: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the content control settings can be changed. Default: true', examples: [true] }))),
        modifyFilter: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the filter can be applied globally (true) or locally (false). Default: true', examples: [true] }))),
        print: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the document can be printed. Default: true', examples: [true] }))),
        protect: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the Protection tab on the toolbar is displayed. Default: true', examples: [true] }))),
        rename: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Allows to display the Rename button. Default: false. Deprecated since 6.0.', examples: [true] }))),
        review: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the document can be reviewed. Default coincides with edit parameter.', examples: [true] }))),
        reviewGroups: v.optional(v.pipe(v.array(v.string()), v.metadata({ description: 'Defines the groups whose changes the user can accept/reject', examples: [['Group1', 'Group2', '']] }))),
        userInfoGroups: v.optional(v.pipe(v.array(v.string()), v.metadata({ description: 'Defines the groups of users whose information is displayed in the editors', examples: [['Group1', '']] }))),
    }),
    v.metadata({ description: 'Allows to change the permission for the document to be edited and downloaded or not' }),
)

const SharingSettingsItemSchema = v.object({
    isLink: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Changes the user icon to the link icon', examples: [false] }))),
    permissions: v.optional(v.pipe(
        v.picklist(['Full Access', 'Read Only', 'Deny Access'] as const),
        v.metadata({ description: 'The access rights for the user', examples: ['Full Access'] }),
    )),
    user: v.optional(v.pipe(v.string(), v.metadata({ description: 'The name of the user the document will be shared with', examples: ['John Smith'] }))),
})

const DocumentInfoSchema = v.pipe(
    v.object({
        author: v.optional(v.pipe(v.string(), v.metadata({ description: 'Defines the name of the document author/creator. Deprecated since 5.4, use owner instead.', examples: ['John Smith'] }))),
        created: v.optional(v.pipe(v.string(), v.metadata({ description: 'Defines the document creation date. Deprecated since 5.4, use uploaded instead.', examples: ['2010-07-07 3:46 PM'] }))),
        favorite: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines the highlighting state of the Favorite icon. If undefined/null, the icon is not displayed.', examples: [true] }))),
        folder: v.optional(v.pipe(v.string(), v.metadata({ description: 'Defines the folder where the document is stored (can be empty for root folder)', examples: ['Example Files'] }))),
        owner: v.optional(v.pipe(v.string(), v.metadata({ description: 'Defines the name of the document owner/creator', examples: ['John Smith'] }))),
        sharingSettings: v.optional(v.pipe(
            v.array(SharingSettingsItemSchema),
            v.metadata({ description: 'Displays the information about the settings which allow to share the document with other users' }),
        )),
        uploaded: v.optional(v.pipe(v.string(), v.metadata({ description: 'Defines the document uploading date', examples: ['2010-07-07 3:46 PM'] }))),
    }),
    v.metadata({ description: 'Allows to change additional parameters for the document (owner, folder, uploading date, sharing settings)' }),
)

const DocumentSchema = v.pipe(
    v.object({
        fileType: v.optional(v.pipe(FileTypeSchema, v.metadata({ description: 'Defines the type of the file for the source viewed or edited document. Must be lowercase.', examples: ['docx'] }))),
        isForm: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the PDF file is a PDF form or a standard PDF file. Default: true', examples: [true] }))),
        key: v.optional(v.pipe(v.string(), v.metadata({ description: 'Defines the unique document identifier used by the service to recognize the document. Must be unique, max 128 characters. Allowed chars: 0-9, a-z, A-Z, -._=', examples: ['Khirz6zTPdfd7'] }))),
        referenceData: v.optional(v.pipe(
            v.object({
                fileKey: v.optional(v.pipe(v.string(), v.metadata({ description: 'The unique document identifier used by the service to get a link to the file', examples: ['BCFA2CED'] }))),
                instanceId: v.optional(v.pipe(v.string(), v.metadata({ description: 'The unique system identifier', examples: ['https://example.com'] }))),
            }),
            v.metadata({ description: 'Defines an object that is generated by the integrator to uniquely identify a file in its system' }),
        )),
        title: v.optional(v.pipe(v.string(), v.metadata({ description: 'Defines the desired file name for the viewed or edited document. Max 128 characters.', examples: ['Example Document Title.docx'] }))),
        url: v.optional(v.pipe(v.string(), v.metadata({ description: 'Defines the absolute URL where the source viewed or edited document is stored', examples: ['https://example.com/url-to-example-document.docx'] }))),
        permissions: v.optional(PermissionsSchema),
        info: v.optional(DocumentInfoSchema),
    }),
    v.metadata({ description: 'Defines document parameters and access settings' }),
)

const EditorUserSchema = v.pipe(
    v.object({
        firstname: v.optional(v.pipe(v.string(), v.metadata({ description: 'The first name of the user. Deprecated since 4.2, use user.name instead', examples: ['John'] }))),
        group: v.optional(v.pipe(v.string(), v.metadata({ description: 'The group (or several groups separated with commas) the user belongs to', examples: ['Group1,Group2'] }))),
        id: v.optional(v.pipe(v.string(), v.metadata({ description: 'The identification of the user. Max 128 characters. Recommended to use anonymized hash.', examples: ['78e1e841'] }))),
        image: v.optional(v.pipe(v.string(), v.metadata({ description: "The path to the user's avatar", examples: ['https://example.com/url-to-user-avatar.png'] }))),
        lastname: v.optional(v.pipe(v.string(), v.metadata({ description: 'The last name of the user. Deprecated since 4.2, use user.name instead', examples: ['Smith'] }))),
        name: v.optional(v.pipe(v.string(), v.metadata({ description: 'The full name of the user. Max 128 characters. Used since version 4.2.', examples: ['John Smith'] }))),
    }),
    v.metadata({ description: 'Defines the user currently viewing or editing the document' }),
)

const SpellcheckSchema = v.pipe(
    v.union([
        v.boolean(),
        v.object({
            mode: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the spell checker is automatically switched on or off', examples: [true] }))),
        }),
    ]),
    v.metadata({ description: 'Defines if the spell checker is enabled', examples: [true] }),
)

const TabBackgroundSchema = v.pipe(
    v.union([
        v.picklist(['header', 'toolbar'] as const),
        v.object({
            mode: v.optional(v.pipe(
                v.picklist(['header', 'toolbar'] as const),
                v.metadata({ description: 'The tab background mode. Default: header', examples: ['header'] }),
            )),
            change: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the tab background setting will be displayed', examples: [true] }))),
        }),
    ]),
    v.metadata({ description: 'Defines the background of the top toolbar tabs' }),
)

const TabStyleSchema = v.pipe(
    v.union([
        v.picklist(['fill', 'line'] as const),
        v.object({
            mode: v.optional(v.pipe(
                v.picklist(['fill', 'line'] as const),
                v.metadata({ description: 'The tab style mode. Default: fill', examples: ['fill'] }),
            )),
            change: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the tab style setting will be displayed', examples: [true] }))),
        }),
    ]),
    v.metadata({ description: 'Defines the style of the top toolbar tabs' }),
)

const FeaturesSchema = v.pipe(
    v.object({
        featuresTips: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if tooltips about new editor features will be displayed. Default: true', examples: [true] }))),
        roles: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if role settings are disabled in pdf forms. Default: true', examples: [true] }))),
        spellcheck: v.optional(SpellcheckSchema),
        tabBackground: v.optional(TabBackgroundSchema),
        tabStyle: v.optional(TabStyleSchema),
    }),
    v.metadata({ description: 'Defines feature settings' }),
)

const LayoutHeaderSchema = v.object({
    editMode: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the header is displayed in edit mode. Default: true', examples: [true] }))),
    save: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the Save button is displayed. Default: true', examples: [true] }))),
    user: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the user name and avatar are displayed. Default: true', examples: [true] }))),
    users: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the button with the editing users is displayed. Default: true', examples: [true] }))),
})

const LayoutLeftMenuSchema = v.pipe(
    v.union([
        v.boolean(),
        v.object({
            mode: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines the initial value of the left panel visibility. Default: true', examples: [true] }))),
            navigation: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the Navigation button is displayed. Available for document editor only. Default: true', examples: [true] }))),
            spellcheck: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the Spellcheck button is displayed. Available for spreadsheet editor only. Default: true', examples: [true] }))),
        }),
    ]),
    v.metadata({ description: 'Defines the left menu settings' }),
)

const LayoutRightMenuSchema = v.pipe(
    v.union([
        v.boolean(),
        v.object({
            mode: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines the initial value of the right panel visibility. Default: true', examples: [true] }))),
        }),
    ]),
    v.metadata({ description: 'Defines the right menu settings' }),
)

const LayoutStatusBarSchema = v.pipe(
    v.union([
        v.boolean(),
        v.object({
            actionStatus: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if an action status is displayed. Default: true', examples: [true] }))),
            docLang: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if a button for choosing the document language is displayed. Default: true', examples: [true] }))),
            textLang: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if a button for choosing the text language is displayed. Default: true', examples: [true] }))),
        }),
    ]),
    v.metadata({ description: 'Defines the status bar settings' }),
)

const LayoutToolbarCollaborationSchema = v.pipe(
    v.union([
        v.boolean(),
        v.object({
            mailmerge: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the button for choosing the mail merge base is displayed. Default: true', examples: [true] }))),
        }),
    ]),
    v.metadata({ description: 'Defines the Collaboration tab settings' }),
)

const LayoutToolbarFileSchema = v.pipe(
    v.union([
        v.boolean(),
        v.object({
            close: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the Close menu option is displayed. Default: true', examples: [true] }))),
            info: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the Document info option is displayed. Default: true', examples: [true] }))),
            save: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the Save option is displayed. Default: true', examples: [true] }))),
            settings: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the Advanced settings option is displayed. Default: true', examples: [true] }))),
        }),
    ]),
    v.metadata({ description: 'Defines the File tab settings' }),
)

const LayoutToolbarViewSchema = v.pipe(
    v.union([
        v.boolean(),
        v.object({
            navigation: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the Navigation button is displayed. Available for document editor only. Default: true', examples: [true] }))),
        }),
    ]),
    v.metadata({ description: 'Defines the View tab settings' }),
)

const LayoutToolbarSchema = v.pipe(
    v.union([
        v.boolean(),
        v.object({
            collaboration: v.optional(LayoutToolbarCollaborationSchema),
            draw: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the Draw tab is displayed. Default: true', examples: [true] }))),
            file: v.optional(LayoutToolbarFileSchema),
            home: v.optional(v.pipe(v.object({}), v.metadata({ description: 'Defines the Home tab settings. This tab cannot be hidden.' }))),
            layout: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the Layout tab is displayed. Available for document and spreadsheet editors. Default: true', examples: [true] }))),
            plugins: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the Plugins tab is displayed. Default: true', examples: [true] }))),
            protect: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the Protection tab is displayed. Default: true', examples: [true] }))),
            references: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the References tab is displayed. Available for document editor only. Default: true', examples: [true] }))),
            save: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the Save button on the toolbar is displayed. Used when compactHeader is true. Default: true', examples: [true] }))),
            view: v.optional(LayoutToolbarViewSchema),
        }),
    ]),
    v.metadata({ description: 'Defines the toolbar settings' }),
)

const LayoutSchema = v.pipe(
    v.object({
        header: v.optional(LayoutHeaderSchema),
        leftMenu: v.optional(LayoutLeftMenuSchema),
        rightMenu: v.optional(LayoutRightMenuSchema),
        statusBar: v.optional(LayoutStatusBarSchema),
        toolbar: v.optional(LayoutToolbarSchema),
    }),
    v.metadata({ description: 'Defines UI layout settings' }),
)

const ReviewModeSchema = v.pipe(
    v.object({
        hideReviewDisplay: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the Display mode button is displayed on the Collaboration tab. Default: false', examples: [false] }))),
        hoverMode: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines the review display mode: tooltips (true) or balloons (false). Default: false', examples: [false] }))),
        reviewDisplay: v.optional(v.pipe(
            v.picklist(['markup', 'simple', 'final', 'original'] as const),
            v.metadata({ description: 'Defines the review display mode. Default: original', examples: ['original'] }),
        )),
        showReviewChanges: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the review changes panel is automatically displayed. Default: false', examples: [false] }))),
        trackChanges: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the document is opened in the review editing mode. Default: depends on document.permissions.review', examples: [true] }))),
    }),
    v.metadata({ description: 'Contains the information about the review mode' }),
)

const SubmitFormSchema = v.pipe(
    v.union([
        v.boolean(),
        v.object({
            visible: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines whether the Complete & Submit button will be displayed. Default: true', examples: [true] }))),
            resultMessage: v.optional(v.pipe(v.string(), v.metadata({ description: 'Defines a message displayed after forms are submitted', examples: ['text'] }))),
        }),
    ]),
    v.metadata({ description: 'Defines the Complete & Submit button settings. Available since 8.3. Default: true' }),
)

const FeedbackSchema = v.pipe(
    v.union([
        v.boolean(),
        v.object({
            url: v.optional(v.pipe(v.string(), v.metadata({ description: 'The absolute URL to the website address for feedback', examples: ['https://example.com'] }))),
            visible: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Shows or hides the Feedback & Support menu button', examples: [true] }))),
        }),
    ]),
    v.metadata({ description: 'Defines settings for the Feedback & Support menu button. Default: false' }),
)

const CustomizationSchema = v.pipe(
    v.object({
        about: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the About menu button is displayed or hidden', examples: [true] }))),
        anonymous: v.optional(v.pipe(
            v.object({
                request: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if to request anonymous user label', examples: [true] }))),
                label: v.optional(v.pipe(v.string(), v.metadata({ description: 'The label for anonymous users', examples: ['Guest'] }))),
            }),
            v.metadata({ description: 'Defines anonymous user settings' }),
        )),
        autosave: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if autosave is enabled or disabled', examples: [true] }))),
        close: v.optional(v.pipe(
            v.object({
                visible: v.optional(v.boolean()),
                text: v.optional(v.string()),
            }),
            v.metadata({ description: 'Defines settings for the Close button' }),
        )),
        comments: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the comments functionality is enabled', examples: [true] }))),
        compactHeader: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the editor header is displayed in a compact mode', examples: [false] }))),
        compactToolbar: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the editor toolbar is displayed in a compact mode', examples: [false] }))),
        compatibleFeatures: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if compatible features are enabled', examples: [false] }))),
        customer: v.optional(v.pipe(
            v.object({
                address: v.optional(v.string()),
                info: v.optional(v.string()),
                logo: v.optional(v.string()),
                logoDark: v.optional(v.string()),
                mail: v.optional(v.string()),
                name: v.optional(v.string()),
                phone: v.optional(v.string()),
                www: v.optional(v.string()),
            }),
            v.metadata({ description: 'Defines customer information' }),
        )),
        features: v.optional(FeaturesSchema),
        feedback: v.optional(FeedbackSchema),
        forcesave: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Adds the request for force saving when saving the document. Default: false', examples: [false] }))),
        forceWesternFontSize: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if Western (true) or Chinese (false) font size is used in Chinese UI. Default: false', examples: [false] }))),
        goback: v.optional(v.pipe(
            v.object({
                blank: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Opens the website in a new browser tab (true) or current tab (false). Default: true', examples: [true] }))),
                requestClose: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Calls events.onRequestClose instead of opening a browser tab. Deprecated since 8.1.', examples: [false] }))),
                text: v.optional(v.pipe(v.string(), v.metadata({ description: 'The text for the Open file location button', examples: ['Open file location'] }))),
                url: v.optional(v.pipe(v.string(), v.metadata({ description: 'The absolute URL to open when clicking the button', examples: ['https://example.com'] }))),
            }),
            v.metadata({ description: 'Defines settings for the Open file location menu button' }),
        )),
        help: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the Help menu button is displayed or hidden. Default: true', examples: [true] }))),
        hideNotes: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the note panel is displayed or hidden on first loading. Available for presentation editor only. Default: false', examples: [false] }))),
        hideRightMenu: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the right menu is displayed or hidden on first loading. Default: true', examples: [true] }))),
        hideRulers: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the editor rulers are displayed or hidden. Default: false for documents, true for presentations', examples: [false] }))),
        integrationMode: v.optional(v.pipe(v.string(), v.metadata({ description: 'Defines the mode of embedding editors into the web page', examples: ['embed'] }))),
        logo: v.optional(v.pipe(
            v.object({
                image: v.optional(v.pipe(v.string(), v.metadata({ description: 'Path to the image file (300x20)', examples: ['https://example.com/logo.png'] }))),
                imageDark: v.optional(v.pipe(v.string(), v.metadata({ description: 'Path to the image file for dark header (300x20)', examples: ['https://example.com/dark-logo.png'] }))),
                imageLight: v.optional(v.pipe(v.string(), v.metadata({ description: 'Path to the image file for light header (300x20)', examples: ['https://example.com/light-logo.png'] }))),
                imageEmbedded: v.optional(v.pipe(v.string(), v.metadata({ description: 'Path to the image file for embedded mode (248x40). Deprecated since 7.0.', examples: ['https://example.com/logo_em.png'] }))),
                url: v.optional(v.pipe(v.string(), v.metadata({ description: 'The absolute URL which will be used when someone clicks the logo image', examples: ['https://example.com'] }))),
                visible: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Shows or hides the logo. Default: true', examples: [true] }))),
            }),
            v.metadata({ description: 'Changes the image file at the top left corner of the editor header. Recommended height: 20 pixels.' }),
        )),
        macros: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if document macros will be automatically run when the editor opens. Default: true', examples: [true] }))),
        macrosMode: v.optional(v.pipe(
            v.picklist(['disable', 'warn', 'enable'] as const),
            v.metadata({ description: 'Defines the macros run mode when autostart is enabled. Default: warn', examples: ['warn'] }),
        )),
        mentionShare: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines the hint that describes the event after mentions in a comment. Default: true', examples: [true] }))),
        mobile: v.optional(v.pipe(
            v.object({
                forceView: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines whether the view mode is enabled on launch. Default: true', examples: [true] }))),
                info: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines whether the Document Info button is displayed. Default: false', examples: [false] }))),
                standardView: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines whether the editor will be opened in Standard view. Default: false', examples: [false] }))),
            }),
            v.metadata({ description: 'Defines the mobile document editor settings' }),
        )),
        mobileForceView: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the mobile document editor is opened in view/edit mode on launch. Deprecated since 8.2, use mobile parameter instead.', examples: [true] }))),
        plugins: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if plugins will be launched and available. Default: true', examples: [true] }))),
        pointerMode: v.optional(v.pipe(
            v.picklist(['select', 'hand'] as const),
            v.metadata({ description: 'Defines the pointer mode when the presentation editor is loaded in the viewer. Default: select', examples: ['select'] }),
        )),
        review: v.optional(ReviewModeSchema),
        reviewDisplay: v.optional(v.pipe(
            v.picklist(['markup', 'simple', 'final', 'original'] as const),
            v.metadata({ description: 'Defines the review editing mode in the document editor. Deprecated since 7.0, use review.reviewDisplay instead.', examples: ['original'] }),
        )),
        showHorizontalScroll: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the horizontal scroll is automatically displayed when the spreadsheet editor is loaded. Available since 8.3. Default: true', examples: [true] }))),
        showReviewChanges: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the review changes panel is automatically displayed. Deprecated since 7.0, use review.showReviewChanges instead.', examples: [false] }))),
        showVerticalScroll: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the vertical scroll is automatically displayed when the spreadsheet editor is loaded. Available since 8.3. Default: true', examples: [true] }))),
        slidePlayerBackground: v.optional(v.pipe(v.string(), v.metadata({ description: 'Defines the background color for the slide show in the presentation editor. Can be HEX, RGB, or RGBA. Available since 8.3.', examples: ['#000000'] }))),
        spellcheck: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the spell checker is automatically switched on or off. Deprecated since 7.1, use features.spellcheck instead.', examples: [true] }))),
        submitForm: v.optional(SubmitFormSchema),
        suggestFeature: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines whether the Suggest a Feature menu button will be displayed. Default: true', examples: [true] }))),
        toolbarHideFileName: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the document title is visible on the top toolbar. Default: false', examples: [false] }))),
        toolbarNoTabs: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the top toolbar tabs are distinctly displayed (false) or only highlighted (true). Deprecated since 8.2.', examples: [false] }))),
        trackChanges: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the document is opened in the review editing mode. Deprecated since 7.0, use review.trackChanges instead.', examples: [true] }))),
        uiTheme: v.optional(v.pipe(
            v.picklist(['theme-light', 'theme-classic-light', 'theme-dark', 'theme-contrast-dark', 'theme-white', 'theme-night', 'default-dark', 'default-light'] as const),
            v.metadata({ description: 'Defines the editor theme settings. Default: theme-classic-light', examples: ['theme-dark'] }),
        )),
        unit: v.optional(v.pipe(
            v.picklist(['cm', 'pt', 'inch'] as const),
            v.metadata({ description: 'Defines the measurement units used on the ruler. Default: cm', examples: ['cm'] }),
        )),
        wordHeadingsColor: v.optional(v.pipe(v.string(), v.metadata({ description: 'Defines the HEX color for the default heading styles in the document editor. Available since 8.3.', examples: ['#00ff00'] }))),
        zoom: v.optional(v.pipe(v.pipe(v.number(), v.integer()), v.metadata({ description: 'Defines the document display zoom value in percent. Can be -1 (fit to page) or -2 (fit width). Default: 100', examples: [100] }))),
        layout: v.optional(LayoutSchema),
        leftMenu: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the left menu panel is displayed or hidden. Deprecated since 7.1, use layout.leftMenu instead.', examples: [true] }))),
        loaderLogo: v.optional(v.pipe(v.string(), v.metadata({ description: 'Defines the path to the image logo which will be displayed while the document is being loaded', examples: ['https://example.com/loader-logo.png'] }))),
        loaderName: v.optional(v.pipe(v.string(), v.metadata({ description: 'Defines the text which will be displayed while the document is being loaded', examples: ['The document is loading, please wait...'] }))),
        rightMenu: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the right menu panel is displayed or hidden. Deprecated since 7.1, use layout.rightMenu instead.', examples: [true] }))),
        statusBar: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the status bar is displayed or hidden. Deprecated since 7.1, use layout.statusBar instead.', examples: [true] }))),
        toolbar: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the top toolbar is displayed or hidden. Deprecated since 7.1, use layout.toolbar instead.', examples: [true] }))),
    }),
    v.metadata({ description: 'Allows to customize editor interface and behavior' }),
)

// ── editorConfig ──────────────────────────────────────────────────────────────

const RecentItemSchema = v.object({
    folder: v.optional(v.pipe(v.string(), v.metadata({ description: 'The folder where the document is stored', examples: ['Example Files'] }))),
    title: v.optional(v.pipe(v.string(), v.metadata({ description: 'The document title that will be displayed in the Open Recent menu', examples: ['exampledocument1.docx'] }))),
    url: v.optional(v.pipe(v.string(), v.metadata({ description: 'The absolute URL to the document', examples: ['https://example.com/exampledocument1.docx'] }))),
})

const TemplateItemSchema = v.object({
    image: v.optional(v.pipe(v.string(), v.metadata({ description: 'The absolute URL to the image for template', examples: ['https://example.com/exampletemplate1.png'] }))),
    title: v.optional(v.pipe(v.string(), v.metadata({ description: 'The template title that will be displayed in the Create New menu', examples: ['exampletemplate1.docx'] }))),
    url: v.optional(v.pipe(v.string(), v.metadata({ description: 'The absolute URL to the document where it will be created', examples: ['https://example.com/url-to-create-template1'] }))),
})

const EditorConfigSchema = v.pipe(
    v.object({
        actionLink: v.optional(v.pipe(v.string(), v.metadata({ description: 'Specifies the data received from the document editing service using the onMakeActionLink event or the onRequestSendNotify event', examples: ['ACTION_DATA'] }))),
        callbackUrl: v.optional(v.pipe(v.string(), v.metadata({ description: 'Specifies absolute URL to the document storage service (required)', examples: ['https://example.com/url-to-callback.ashx'] }))),
        coEditing: v.optional(v.pipe(
            v.object({
                mode: v.optional(v.pipe(
                    v.picklist(['fast', 'strict'] as const),
                    v.metadata({ description: 'The co-editing mode. Default: fast', examples: ['fast'] }),
                )),
                change: v.optional(v.pipe(v.boolean(), v.metadata({ description: 'Defines if the co-editing mode can be changed in the editor interface. Default: true', examples: [true] }))),
            }),
            v.metadata({ description: 'Defines the co-editing mode (Fast or Strict) and the possibility to change it' }),
        )),
        createUrl: v.optional(v.pipe(v.string(), v.metadata({ description: 'Defines the absolute URL of the document where it will be created and available after creation', examples: ['https://example.com/url-to-create-document/'] }))),
        lang: v.optional(v.pipe(v.string(), v.metadata({ description: 'Defines the editor interface language using two-letter language codes (de, ru, it, etc.). For Portuguese (Portugal) or Chinese (Traditional, Taiwan) use pt-PT or zh-TW. Default: en', examples: ['en'] }))),
        location: v.optional(v.pipe(v.string(), v.metadata({ description: 'Defines the default measurement units. Specify us or ca for inches. Deprecated since 8.2, use region parameter instead.', examples: [''] }))),
        mode: v.optional(v.pipe(
            v.picklist(['view', 'edit'] as const),
            v.metadata({ description: 'Defines the editor opening mode. Default: edit', examples: ['edit'] }),
        )),
        recent: v.optional(v.pipe(v.array(RecentItemSchema), v.metadata({ description: 'Defines the presence or absence of the documents in the Open Recent menu option' }))),
        region: v.optional(v.pipe(v.string(), v.metadata({ description: 'Defines the default display format for currency and date/time using four letter codes (en-US, fr-FR, etc.). Default: en-US', examples: ['en-US'] }))),
        templates: v.optional(v.pipe(v.array(TemplateItemSchema), v.metadata({ description: 'Defines the presence or absence of the templates in the Create New menu option' }))),
        user: v.optional(EditorUserSchema),
        customization: v.optional(CustomizationSchema),
        embedded: v.optional(v.pipe(
            v.object({
                embedUrl: v.optional(v.pipe(v.string(), v.metadata({ description: 'Defines the absolute URL which will be used when clicking the embed button', examples: ['https://example.com/embedded?doc=document1.docx'] }))),
                fullscreenUrl: v.optional(v.pipe(v.string(), v.metadata({ description: 'Defines the absolute URL which will be used when clicking the fullscreen button', examples: ['https://example.com/embedded?doc=document1.docx#fullscreen'] }))),
                saveUrl: v.optional(v.pipe(v.string(), v.metadata({ description: "Defines the absolute URL that will allow the document to be saved onto the user's computer", examples: ['https://example.com/download?doc=exampledocument1.docx'] }))),
                shareUrl: v.optional(v.pipe(v.string(), v.metadata({ description: 'Defines the absolute URL that will allow other users to share this document', examples: ['https://example.com/view?doc=exampledocument1.docx'] }))),
                toolbarDocked: v.optional(v.pipe(
                    v.picklist(['top', 'bottom'] as const),
                    v.metadata({ description: 'Defines the place for the embedded viewer toolbar', examples: ['top'] }),
                )),
            }),
            v.metadata({ description: 'Defines settings for the embedded viewer' }),
        )),
        plugins: v.optional(v.pipe(
            v.object({
                autostart: v.optional(v.pipe(v.array(v.string()), v.metadata({ description: 'Defines the array of plugin GUIDs that will be automatically started', examples: [['asc.{7327FC95-16DA-41D9-9AF2-0E7F449F6800}']] }))),
                options: v.optional(v.pipe(
                    v.record(v.string(), v.record(v.string(), v.unknown())),
                    v.metadata({ description: 'Defines an object which allows configuring plugins from an external source' }),
                )),
                pluginsData: v.optional(v.pipe(v.array(v.string()), v.metadata({ description: 'Defines the array of absolute URLs to the plugin configuration files (config.json)', examples: [['https://example.com/plugins/chess-plugin/config.json']] }))),
                url: v.optional(v.pipe(v.string(), v.metadata({ description: 'Defines the absolute URL to the directory where the plugins are stored. Deprecated since 4.3.', examples: ['https://example.com/plugins/'] }))),
            }),
            v.metadata({ description: 'Defines plugin configuration' }),
        )),
    }),
    v.metadata({ description: 'Allows to change the parameters pertaining to the editor interface: opening mode, language, buttons, etc.' }),
)

const EventsSchema = v.pipe(
    v.object({
        onAppReady: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when the application is loaded into the browser' }))),
        onCollaborativeChanges: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when the document is co-edited by another user in the strict co-editing mode' }))),
        onDocumentReady: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when the document is loaded into the document editor' }))),
        onDocumentStateChange: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when the document is modified' }))),
        onDownloadAs: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called with the absolute URL to the edited file when the downloadAs method is being called' }))),
        onError: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when an error or some other specific event occurs' }))),
        onInfo: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when the application opened the file' }))),
        onMakeActionLink: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when the user is trying to get link for opening the document which contains a bookmark' }))),
        onMetaChange: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when the meta information of the document is changed via the meta command' }))),
        onOutdatedVersion: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called after the error is shown, when the document is opened for editing with the old document.key value. Deprecated since 8.3, use onRequestRefreshFile instead.' }))),
        onPluginsReady: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when all plugins are loaded and can be used' }))),
        onReady: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when the application is loaded into the browser. Deprecated since 5.0, use onAppReady instead.' }))),
        onRequestClose: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when the user is trying to end the work with the editor and close it' }))),
        onRequestCompareFile: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when the user is trying to select document for comparing. Available only for ONLYOFFICE Docs Enterprise. Deprecated since 7.5, use onRequestSelectDocument instead.' }))),
        onRequestCreateNew: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when the user is trying to create document by clicking the Create New button' }))),
        onRequestEditRights: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when the user is trying to switch the document from viewing into editing mode' }))),
        onRequestHistory: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when the user is trying to show the document version history' }))),
        onRequestHistoryClose: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when the user is trying to go back to the document from viewing the document version history' }))),
        onRequestHistoryData: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when the user is trying to click the specific document version in the document version history' }))),
        onRequestInsertImage: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when the user is trying to insert an image by clicking the Image from Storage button' }))),
        onRequestMailMergeRecipients: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when the user is trying to select recipients data by clicking the Mail merge button. Deprecated since 7.5, use onRequestSelectSpreadsheet instead.' }))),
        onRequestOpen: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when the user is trying to open an external link by clicking the Open source button' }))),
        onRequestReferenceData: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when the user is trying to refresh data inserted from the external file' }))),
        onRequestReferenceSource: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when the user is trying to change a source of the external data by clicking the Change source button' }))),
        onRequestRefreshFile: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called instead of the onOutdatedVersion event when the editor is opened with key that was already used or when reconnecting after losing connection' }))),
        onRequestRename: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when the user is trying to rename the file by clicking the Rename button' }))),
        onRequestRestore: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when the user is trying to restore the file version by clicking the Restore button in the version history' }))),
        onRequestSaveAs: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when the user is trying to save file by clicking Save Copy as button' }))),
        onRequestSelectDocument: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when the user is trying to select a document for comparing, combining, or inserting text' }))),
        onRequestSelectSpreadsheet: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when the user is trying to select recipients data by clicking the Mail merge button' }))),
        onRequestSendNotify: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when the user is mentioned in a comment' }))),
        onRequestSharingSettings: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when the user is trying to manage document access rights' }))),
        onRequestStartFilling: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when the user is trying to start filling out the ready forms in pdf editing mode' }))),
        onRequestUsers: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when the user can select other users to mention in the comments or grant the access rights' }))),
        onSubmit: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when the force saving request is successfully performed, when the Complete & Submit button is clicked' }))),
        onUserActionRequired: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when a user action is required to open a document (password, encoding selection, etc.)' }))),
        onWarning: v.optional(v.pipe(v.string(), v.metadata({ description: 'The function called when a warning occurs' }))),
    }),
    v.metadata({ description: 'Defines event handlers for document editor' }),
)

export const EditorConfigRootSchema = v.object({
    documentType: v.optional(v.pipe(
        v.picklist(['word', 'cell', 'slide', 'pdf', 'diagram'] as const),
        v.metadata({ description: 'Defines the document type to be opened', examples: ['cell'] }),
    )),
    height: v.optional(v.pipe(v.string(), v.metadata({ description: 'Defines the document height (100% by default) in the browser window', examples: ['100%', '550px'] }))),
    width: v.optional(v.pipe(v.string(), v.metadata({ description: 'Defines the document width (100% by default) in the browser window', examples: ['100%'] }))),
    token: v.optional(v.pipe(v.string(), v.metadata({ description: 'Defines the encrypted signature added to the ONLYOFFICE Docs config in the form of a token', examples: ['eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.LwimMJA3puF3ioGeS-tfczR3370GXBZMIL-bdpu4hOU'] }))),
    type: v.optional(v.pipe(
        v.picklist(['desktop', 'mobile', 'embedded'] as const),
        v.metadata({ description: 'Defines the platform type used to access the document. Default: desktop', examples: ['desktop'] }),
    )),
    document: v.optional(DocumentSchema),
    editorConfig: v.optional(EditorConfigSchema),
    events: v.optional(EventsSchema),
})
