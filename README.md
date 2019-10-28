# Swan
 A note taking app with encryption and Google Drive synchronization.
 In the current release, each note has one text editor with full markdown support and an unlimited amount of todo lists.


## Note options and actions

- Hide text editor and todo lists

- Minimize or maximize all todo lists

- Copy note

- Move note to another folder

- Archive note

- Delete note

The same actions apply in the folder view. Also, notes are draggable in the folder view.


## Todo list features

- Copy list with its todos

- Customize where the checked items appear: top, bottom, or in their initial position

- All lists and items in them are draggable

- Maximize or minimize each list individually

- Shows the completed vs all items


## Folders

- Drag folders by hovering on the folder icon

- Rename or remove the folder in options

- When deleting a folder, you can either choose to move all its notes to another folder, or delete them with the folder

## Settings

### Security

- Enable/disable encryption. At the moment, AES-256 encryption with random salt is used. The user password is never stored on the computer. The random test hash derived from the password is used instead for verifying the password. There are plans to ramp up the security in [future releases](#roadmap).
If Google Drive sync is on, when disabling encryption, the google token will be revoked and sync turned off automatically. The drive files will **not** be deleted. If you wish to delete all drives files, [do that beforehand](#deleting-all-drive-files).

- Clear all data. This will erase all local data on your computer. Google Drive files are not affected. See [restore section](#restore-from-drive) on how to restore your data from Google Drive.

- Change password. The files will be re-encrypted with the new password and automatically uploaded to Google Drive if sync is turned on.


### Synchronization

#### Turning on the synchronization

In order to use this feature, you will have to enable encryption first. And then it's as simple as pressing the button and following Google prompts in the new window! The app uses your Google account to access the drive files scoped specifically to the application. It means that the app has **no access** to any other of your Google Drive files, and limited to its own scope. No other Google account information is neither requested nor used.

After you connected your google account, the app will check if you already have previously stored files. If so, the app will prompt you to: download drive files and replace all local ones, upload your current local files to drive and erase the previous version, or do nothing.

**If you decide to download & replace, make sure to read [restore section](#restore-from-drive).**


#### Sync frequency

Sync frequency determines how often your local files will be uploaded to Google Drive. Ranges are from 5 minutes to an hour. Or you can disable auto sync entirely.

#### Manual sync

Simply uploads the local files to Google Drive after the button press.

#### Restore from drive

If you choose to download drive files and replace the local ones, make sure to **use the same encryption password**. All files stored/transmitted to Google Drive are always encrypted, thus making it impossible to decipher if you use a different password. If you forgot the password, the data is unfortunately lost forever.

In case when you did use a different password and replaced the local files anyway, you will be prompted to clear all data, as it became unusable.

There are two ways to restore from drive. First, when you have a previous version of the files on your drive upon turning on the synchronization.
Second, by pressing the *Replace with drive files* button in the settings.

#### Deleting all drive files

This will delete all app related files on your Google Drive. It **does not** affect the synchronization or the local files.

#### Turning off the synchronization

After pressing the button, the google token will be revoked and sync will be turned off. Revoking the token means that the app will no longer have access to your Google Drive. All Google related data will be erased from your computer.


### Customization

#### Themes
At the moment, you can only choose between dark and light themes. There are plans in the future to allow for theme creation and full color customization.

#### Accent color
There are two presets for the accent color, dark colors for light theme, and light colors for dark theme. However, you can choose any accent color from the full rgb spectrum by pressing on the rectangle with the current accent color background.

While in the color selection menu, the squares on the theme options will change accordingly for a mini preview.

## Roadmap

### Next Release

- [ ] Mass operations with notes (archive, move, delete)
- [ ] Note filters
- [ ] Note tags
- [ ] Pin notes

### The one after that

- [ ] Move todo items/lists between notes
- [ ] Nested items
- [ ] Encryption improvements
- [ ] Protect each note with an individual password/app password
- [ ] Optimization improvements
- [ ] Add files/images
- [ ] Time tracker

### Sometime in the future

- [ ] Theme creation
- [ ] Compact mode
- [ ] Export note content
