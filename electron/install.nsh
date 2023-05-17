!macro customInstall
DetailPrint "Register tears URI Handler"
DeleteRegKey HKCR "tears"
WriteRegStr HKCR "tears""""URL:tears"
WriteRegStr HKCR "tears""tears Protocol"""
WriteRegStr HKCR "tears\\DefaultIcon""""$INSTDIR\\${APP_EXECUTABLE_FILENAME}"
WriteRegStr HKCR "tears\\shell"""""
WriteRegStr HKCR "tears\\shell\\Open"""""
WriteRegStr HKCR "tears\\shell\\Open\\command""""$INSTDIR\\${APP_EXECUTABLE_FILENAME} %1"
!macroend