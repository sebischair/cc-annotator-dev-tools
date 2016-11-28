#*******************************************************************************
#** sourcefile:         asd.tcl                                           **
#**                                                                           **
#** project:                      ssafsdfd                                    **
#**                                                                           **
#** department:         afdadsfsdf                                            **
#**                     asdasdasda ds                                         **
#**                                                                           **
#** initial author:     @author John doe                                      **
#**                                                                           **
#** additional authors: @author                                               **
#**                                                                           **
#*******************************************************************************
#**                                                                           **
#** description:                                                              **
#** @c                                                                        **
#**                                                                           **
#*******************************************************************************
proc testASD {} {
    set drive [ getDrive "MOTOR" ]
    enableAll
    afterRt 1
    # Für die Messung Antrieb in die andere Richtung fahren
    WriteParam $drive 2231 3 4.2
    after 1
    set speed2check [ ReadParam $drive 62 0 ]
}
