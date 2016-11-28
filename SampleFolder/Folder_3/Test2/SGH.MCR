'#Uses "%View%\armtamclib\QlausPlus\Teamlibs_Safety\FGH.bas"

Option Explicit

' * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
' *                                                                                                                     *
' * Author     John Doe                                                                                                 *
' * Email      xyz@qwe.de                                                                                               *
' * Date       2.10.2015                                                                                                *
' * Version    2.0                                                                                                      *
' *                                                                                                                     *
' * Testfall 1264: asdkfjklasd jalksjdfl kjlkasdjf lkjkladsjkj                                                          *
' * askdjfk jklajsdlkfj llkaksdjf jlksfjg nsmnv znxcxvn xcn m,nxc                                                       *
' *                                                                                                                     *
' *                                                                                                                     *
' * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *



Sub SolutionMain

If myCuType <> CU250S_2 Then
    ' Deactivate function module
    ActivateFunctionModule ( Extended_setpoint_channel )

    ' Upload project
    UploadProject ()
End If

If myCuType <> CU250S_2 Then
    ' Deactivate function module
    ActivateFunctionModule ( Extended_setpoint_channel )

    ' Upload project
    UploadProject ()
End If



    ' Wait for communication between CU and F-CPU
    WaitforComm ( PROFIsafe )

    ' Set the drive object number in S7 project
    S7DriveObject ( myDrive )

wait(10)

ErrorHandler:

    OnError( cFunctionName )

End Sub 'SolutionMain
