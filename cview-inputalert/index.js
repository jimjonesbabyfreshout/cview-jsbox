const {
  UIAlertActionStyle,
  UIAlertControllerStyle,
  UIAlertAction,
  UIAlertController
} = require("cview-uialert");

const { l10n } = require("cview-util-localization");

function inputAlert({
  title = "",
  message,
  text = "",
  placeholder,
  type = 0,
  secure = false,
  cancelText = l10n("CANCEL"),
  confirmText = l10n("OK")
} = {}) {
  return new Promise((resolve, reject) => {
    const alertVC = new UIAlertController(
      title,
      message,
      UIAlertControllerStyle.Alert
    );
    alertVC.addTextField({
      placeholder,
      text,
      type,
      secure,
      events: {
        shouldReturn: () => {
          const input = alertVC.getText(0);
          const isValid = input.length > 0;
          return isValid;
        }
      }
    });

    alertVC.addAction(
      new UIAlertAction(cancelText, UIAlertActionStyle.Destructive, cancelEvent)
    );
    alertVC.addAction(
      new UIAlertAction(confirmText, UIAlertActionStyle.Default, confirmEvent)
    );
    alertVC.present();

    function confirmEvent() {
      const input = alertVC.getText(0);
      resolve(input);
    }
    function cancelEvent() {
      reject("cancel");
    }
  });
}

module.exports = inputAlert;
