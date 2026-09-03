param(
    [string]$TemplatePath = 'C:\Users\rishe\Downloads\Compass Program Demos - KMIT.pptx',
    [string]$OutputPath = (Join-Path (Split-Path -Parent $PSScriptRoot) 'OffGo_KMIT_Compass_Final_Presentation.pptx')
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem

if (-not (Test-Path -LiteralPath $TemplatePath)) {
    throw "Presentation template was not found: $TemplatePath"
}

Copy-Item -LiteralPath $TemplatePath -Destination $OutputPath -Force
$archive = [System.IO.Compression.ZipFile]::Open($OutputPath, [System.IO.Compression.ZipArchiveMode]::Update)

function Set-ShapeText {
    param(
        [xml]$Slide,
        [string]$ShapeName,
        [string]$Text
    )

    $shape = $Slide.SelectSingleNode("//*[local-name()='sp'][./*[local-name()='nvSpPr']/*[local-name()='cNvPr']/@name='$ShapeName']")
    if ($null -eq $shape) { throw "Shape not found: $ShapeName" }

    $textNodes = @($shape.SelectNodes(".//*[local-name()='t']"))
    if ($textNodes.Count -eq 0) { throw "No text node found in shape: $ShapeName" }

    $textNodes[0].InnerText = $Text
    for ($i = 1; $i -lt $textNodes.Count; $i++) { $textNodes[$i].InnerText = '' }
}

$slideContent = @{
    1 = @{
        'Google Shape;85;p13' = 'OffGo'
        'Google Shape;86;p13' = 'KMIT Compass Program VTO — Final Project Presentation'
        'Google Shape;87;p13' = "Team : [Add student names]`nSalesforce Mentor : [Mentor name]`n02 September 2026"
    }
    2 = @{
        'Google Shape;94;p14' = "A unified employee-transport platform that connects employees, drivers and administrators in one real-time workflow."
        'Google Shape;95;p14' = 'Solution Overview'
        'Google Shape;96;p14' = "Project at a Glance`nSmart bookings • live visibility • operational control"
        'Google Shape;97;p14' = "Problem`nManual bookings, uncertain shuttle arrival times and fragmented fleet coordination."
    }
    3 = @{
        'Google Shape;103;p15' = "Architecture & Tech Stack`nReact + TypeScript • Spring Boot • PostgreSQL`nREST APIs + WebSockets • JWT Security • Google Maps • ZXing QR"
    }
    4 = @{
        'Google Shape;109;p16' = "Smart Booking`nRoute, schedule & seat selection`nDigital pass with QR verification"
        'Google Shape;110;p16' = 'Key Features'
        'Google Shape;112;p16' = "Live Operations`nLive shuttle tracking & ETA`nDriver check-in and boarding flow"
        'Google Shape;114;p16' = "Admin Control`nFleet, routes & schedules`nApprovals, expenses, reports & complaints"
    }
    5 = @{
        'Google Shape;120;p17' = "Demo Flow`nEmployee books a seat → QR pass is issued → Driver verifies boarding → Admin monitors the fleet"
        'Google Shape;121;p17' = 'Live Demo'
    }
    6 = @{
        'Google Shape;128;p18' = 'Building a dependable, role-aware transport workflow from booking to boarding.'
        'Google Shape;129;p18' = "Technical Challenges`n• Real-time location synchronization`n• Secure role-based access`n• Single-use QR verification"
        'Google Shape;130;p18' = "Key Learnings`n• WebSockets for live state`n• Modular REST architecture`n• Role-focused UX design"
        'Google Shape;131;p18' = 'Challenges & Learnings'
    }
    7 = @{
        'Google Shape;136;p19' = "Thank`nYou"
    }
}

foreach ($slideNumber in $slideContent.Keys) {
    $entryName = "ppt/slides/slide$slideNumber.xml"
    $entry = $archive.GetEntry($entryName)
    if ($null -eq $entry) { throw "Slide is missing from template: $slideNumber" }
    $reader = [System.IO.StreamReader]::new($entry.Open())
    [xml]$slideXml = $reader.ReadToEnd()
    $reader.Dispose()

    foreach ($shapeName in $slideContent[$slideNumber].Keys) {
        Set-ShapeText -Slide $slideXml -ShapeName $shapeName -Text $slideContent[$slideNumber][$shapeName]
    }

    $entry.Delete()
    $newEntry = $archive.CreateEntry($entryName)
    $writer = [System.IO.StreamWriter]::new($newEntry.Open(), [System.Text.UTF8Encoding]::new($false))
    $writer.Write($slideXml.OuterXml)
    $writer.Dispose()
}

$archive.Dispose()
Write-Output "Created: $OutputPath"
