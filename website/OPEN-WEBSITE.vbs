Option Explicit

Dim shell, fso, folder, page, browser

Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
folder = fso.GetParentFolderName(WScript.ScriptFullName)
page = folder & "\index.html"

If Not fso.FileExists(page) Then
  MsgBox "index.html was not found in this folder." & vbCrLf & vbCrLf & _
    "Please extract the full zip download first." & vbCrLf & vbCrLf & folder, _
    vbCritical, "MilePilot Website"
  WScript.Quit 1
End If

browser = FindBrowser()
If browser <> "" Then
  shell.Run Chr(34) & browser & Chr(34) & " " & Chr(34) & page & Chr(34), 1, False
  WScript.Quit 0
End If

MsgBox "Open the website manually:" & vbCrLf & vbCrLf & _
  "1. Open Microsoft Edge from the Start menu" & vbCrLf & _
  "2. Press Ctrl and O together on your keyboard" & vbCrLf & _
  "3. Go to this folder and choose index.html:" & vbCrLf & vbCrLf & folder, _
  vbInformation, "MilePilot Website"

Function FindBrowser()
  Dim paths(4), i
  paths(0) = shell.ExpandEnvironmentStrings("%ProgramFiles%\Microsoft\Edge\Application\msedge.exe")
  paths(1) = shell.ExpandEnvironmentStrings("%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe")
  paths(2) = shell.ExpandEnvironmentStrings("%ProgramFiles%\Google\Chrome\Application\chrome.exe")
  paths(3) = shell.ExpandEnvironmentStrings("%LocalAppData%\Google\Chrome\Application\chrome.exe")
  paths(4) = shell.ExpandEnvironmentStrings("%ProgramFiles%\Mozilla Firefox\firefox.exe")

  For i = 0 To 4
    If fso.FileExists(paths(i)) Then
      FindBrowser = paths(i)
      Exit Function
    End If
  Next

  FindBrowser = ""
End Function
