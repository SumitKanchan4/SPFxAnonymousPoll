Clear-Host
[string] $targetSite = "https://legogroup.sharepoint.com/sites/demosumit"
$username = "dk2SpoM1@corp.lego.com"
$password = Read-Host -Prompt "Enter password" -AsSecureString
$cred = New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList ($username,$Password)
Connect-PnPOnline -Url $targetSite -Credentials $cred

Add-PnPApp -Path "C:\Sumit Apps\Personal Solutions\AnonymousPoll\sharepoint\solution\anonymous-poll.sppkg" -Scope Site -Publish -Overwrite

 Disconnect-PnPOnline
