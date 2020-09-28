
module.exports = {
  views: {
    BaseView: require("cview-baseview"),
    ArtificialFlowlayout: require("cview-artificial-flowlayout"),
    CustomNavigationBar: require("cview-custom-navigationbar"),
    DialogSheet: require("cview-dialog-sheet"),
    DynamicItemSizeMatrix: require("cview-dynamic-itemsize-matrix"),
    DynamicRowHeightList: require("cview-dynamic-rowheight-list"),
    EnhancedImageView: require("cview-enhanced-imageview"),
    ImagePager: require("cview-imagepager"),
    LoadingDoubleRings: require("cview-loading-double-rings"),
    LoadingDualRing: require("cview-loading-dual-ring"),
    LoadingWedges: require("cview-loading-wedges"),
    PageViewer: require("cview-pageviewer"),
    PageViewerTitleBar: require("cview-pageviewer-titlebar"),
    PreferenceListViewDynamic: require("cview-preferencelistview-dynamic"),
    PreferenceListViewStatic: require("cview-preferencelistview-static"),
    RotatingView: require("cview-rotating-view"),
    SearchBar: require("cview-searchbar"),
    Sheet: require("cview-sheet"),
    SpinnerAndroidstyle: require("cview-spinner-androidstyle"),
    SymbolButton: require("cview-symbol-button"),
    TabBar: require("cview-tabbar")
  },
  singleviews: require("cview-singleviews"),
  controllers: {
    BaseController: require("cview-basecontroller"),
    PageViewerController: require("cview-pageviewer-controller"),
    SplitViewController: require("cview-splitview-controller"),
    TabBarController: require("cview-tabbar-controller"),
//    controllerRouter: require("cview-controller-router")
  },
//  model: {
//    HttpLikeApi: require("cview-http-like-api")
//  },
  methods: {
    uialert: require("cview-uialert"),
    plainAlert: require("cview-plainalert"),
    inputAlert: require("cview-inputalert"),
    loginAlert: require("cview-loginalert"),
    textDialog: require("cview-text-dialog"),
    listDialog: require("cview-list-dialog"),
    formDialog: require("cview-form-dialog")
  },
  utils: {
    cvid: require("cview-util-cvid"),
    path: require("cview-util-path"),
    rect: require("cview-util-rect"),
    ui: require("cview-util-ui")
  }
};