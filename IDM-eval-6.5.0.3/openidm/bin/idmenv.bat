@echo off

call:setIDMHome
if %errorlevel% == 1 (
    echo Failed to validate the OPENIDM_HOME environment variable, aborting.
    goto error
)

call:parseArguments %*
if %errorlevel% == 1 (
    echo Failed to parse the command-line arguments, aborting.
    goto error
)

call:setJulLogging
if %errorlevel% == 1 (
    echo Failed to set the JUL logging configuration, aborting.
    goto error
)

call:setJpdaOptions
if %errorlevel% == 1 (
    echo Failed to set the JPDA debug options, aborting.
    goto error
)

call:setJavaOptions
if %errorlevel% == 1 (
    echo Failed to set the JAVA options, aborting.
    goto error
)

call:setJavaHome
if %errorlevel% == 1 (
    echo Failed to configure the Java Home, aborting.
    goto error
)

call:setIDMClasspath
if %errorlevel% == 1 (
    echo Failed to configure the Java Classpath, aborting.
    goto error
)
goto:eof

::-------------------------------------------------------------------------
::-- Set the OPENDIM_HOME environment variable if not already set
::-------------------------------------------------------------------------
:setIDMHome
SETLOCAL
if not "%OPENIDM_HOME%" == "" goto checkHome
pushd %~dp0
cd ..
set "OPENIDM_HOME=%cd%"
popd
:checkHome
if not exist "%OPENIDM_HOME%\bin\felix.jar" (
    echo The specified OpenIDM home '%OPENIDM_HOME%' directory is invalid
    goto error
)
(ENDLOCAL
    set "OPENIDM_HOME=%OPENIDM_HOME%"
)
goto:eof

::-------------------------------------------------------------------------
::-- Set the _RUNJAVA, JAVA_HOME and _JAVADLL environment variables
::-------------------------------------------------------------------------
:setJavaHome
:: Check Java availability
if not "%JAVA_HOME%" == "" goto checkJavaHome
if not "%JRE_HOME%" == "" goto checkJavaHome
echo JAVA_HOME or JRE_HOME not available, Java is required to run the server
echo Please install Java and set the JAVA_HOME accordingly
goto error
:checkJavaHome
if exist "%JAVA_HOME%\bin\java.exe" goto javaHomeOk
if exist "%JRE_HOME%\bin\java.exe" goto jreHomeOk
echo Incorrect JAVA_HOME or JRE_HOME
goto error
:jreHomeOk
set _RUNJAVA="%JRE_HOME%\bin\java.exe"
set _JAVADLL="%JRE_HOME%\bin\server\jvm.dll"
goto homeOk
:javaHomeOk
set _RUNJAVA="%JAVA_HOME%\bin\java.exe"
if exist "%JAVA_HOME%\bin\server\jvm.dll" set _JAVADLL="%JAVA_HOME%\bin\server\jvm.dll" & goto homeOk
if exist "%JAVA_HOME%\jre\bin\server\jvm.dll" set _JAVADLL="%JAVA_HOME%\jre\bin\server\jvm.dll" & goto homeOk
echo Cannot find jvm.dll
goto error
:homeOk
goto:eof

::-------------------------------------------------------------------------
::-- Parse the command-line arguments, setting the PROJECT_HOME,
::-- CMD_LINE_ARGS and JPDA environment variables.
::--
::-- The PROJECT_HOME environment variable defaults to OPENIDM_HOME if not
::-- already set.
::-------------------------------------------------------------------------
:parseArguments
SETLOCAL ENABLEDELAYEDEXPANSION
set "JPDA="
set "PROJECT_HOME=%OPENIDM_HOME%"
set "CMD_LINE_ARGS=-c bin/launcher.json"

:optLoop
if "%1" == "" goto optDone
if "%1" == "jpda" goto optJpda

set CMD_LINE_ARGS=%CMD_LINE_ARGS% %1
if "%1" == "-p" goto optP
shift
goto optLoop

:optJpda
set "JPDA=JPDA"
shift
goto optLoop

:optP
shift
if "%1" == "" goto optDone
set "PROJECT_HOME=%1"
if not exist %PROJECT_HOME% (
    set "PROJECT_HOME=%OPENIDM_HOME%\%1"
)
if not exist %PROJECT_HOME% (
    echo The specified project directory '%1' does not exist
    goto error
)
goto optLoop

:optDone
(ENDLOCAL
    set "PROJECT_HOME=%PROJECT_HOME%"
    set "CMD_LINE_ARGS=%CMD_LINE_ARGS%"
    set "JPDA=%JPDA%"
)
goto:eof

::-------------------------------------------------------------------------
::-- Set the JUL logging configuration to the logging.properties file from
::-- the PROJECT_HOME/conf directory if present. Fallback to either
::-- OPENIDM_HOME/conf/logging.properties or -Dnop.
::-------------------------------------------------------------------------
:setJulLogging
SETLOCAL
if "%LOGGING_CONFIG%" == "" (
    set LOGGING_CONFIG=-Dnop
    if exist "%PROJECT_HOME%\conf\logging.properties" (
        set "LOGGING_CONFIG=-Djava.util.logging.config.file=%PROJECT_HOME%\conf\logging.properties"
    ) else (
        if exist "%OPENIDM_HOME%\conf\logging.properties" (
            set "LOGGING_CONFIG=-Djava.util.logging.config.file=%OPENIDM_HOME%\conf\logging.properties"
        )
    )
)
(ENDLOCAL
    set "LOGGING_CONFIG=%LOGGING_CONFIG%"
)
goto:eof

::-------------------------------------------------------------------------
::-- Set the JPDA debug options if not already set.
::-------------------------------------------------------------------------
:setJpdaOptions
SETLOCAL
if "%JPDA_TRANSPORT%" == "" (
    set "JPDA_TRANSPORT=dt_socket"
)
if "%JPDA_ADDRESS%" == "" (
    set "JPDA_ADDRESS=5005"
)
if "%JPDA_SUSPEND%" == "" (
    set "JPDA_SUSPEND=n"
)
if "%JPDA_OPTS%" == "" (
    set "JPDA_OPTS=-Djava.compiler=NONE -Xnoagent -Xdebug -Xrunjdwp:transport=%JPDA_TRANSPORT%,address=%JPDA_ADDRESS%,server=y,suspend=%JPDA_SUSPEND%"
)
(ENDLOCAL
    set "JPDA_TRANSPORT=%JPDA_TRANSPORT%"
    set "JPDA_ADDRESS=%JPDA_ADDRESS%"
    set "JPDA_SUSPEND=%JPDA_SUSPEND%"
    set "JPDA_OPTS=%JPDA_OPTS%"
)
goto:eof

::-------------------------------------------------------------------------
::-- Set the Java options required by OpenIDM.
::-- Currently limited to options required for running on Java 9 and up.
::-------------------------------------------------------------------------
:setJavaOptions
SETLOCAL
set "JAVA_OPTS=-XX:+IgnoreUnrecognizedVMOptions --add-opens=java.base/jdk.internal.loader=ALL-UNNAMED %JAVA_OPTS%"
(ENDLOCAL
    set "JAVA_OPTS=%JAVA_OPTS%"
)
goto:eof

::-------------------------------------------------------------------------
::-- Set SLF4J and Jackson bundle paths.
::-------------------------------------------------------------------------
:setIDMClasspath
SETLOCAL
set "BUNDLE_PATH=%OPENIDM_HOME%\bundle"
:: Get bundle dependency filenames as "bundle\<fullFilenameWithExtension>"
for /f "delims=" %%a in ('dir /b "%BUNDLE_PATH%\*.jar" ^| findstr "slf4j-api-[0-9]"') do (set SLF4J_API=%BUNDLE_PATH%\%%a)
for /f "delims=" %%a in ('dir /b "%BUNDLE_PATH%\*.jar" ^| findstr "slf4j-jdk14-[0-9]"') do (set SLF4J_JDK14=%BUNDLE_PATH%\%%a)
for /f "delims=" %%a in ('dir /b "%BUNDLE_PATH%\*.jar" ^| findstr "jackson-core-[0-9]"') do (set JACKSON_CORE=%BUNDLE_PATH%\%%a)
for /f "delims=" %%a in ('dir /b "%BUNDLE_PATH%\*.jar" ^| findstr "jackson-databind-[0-9]"') do (set JACKSON_DATABIND=%BUNDLE_PATH%\%%a)
for /f "delims=" %%a in ('dir /b "%BUNDLE_PATH%\*.jar" ^| findstr "jackson-annotations-[0-9]"') do (set JACKSON_ANNOTATIONS=%BUNDLE_PATH%\%%a)
for /f "delims=" %%a in ('dir /b "%BUNDLE_PATH%\*.jar" ^| findstr "openidm-system-[0-9]"') do (set OPENIDM_SYSTEM_PATH=%BUNDLE_PATH%\%%a)
for /f "delims=" %%a in ('dir /b "%BUNDLE_PATH%\*.jar" ^| findstr "openidm-util-[0-9]"') do (set OPENIDM_UTIL_PATH=%BUNDLE_PATH%\%%a)
(ENDLOCAL
    set "IDM_CLASSPATH=%OPENIDM_HOME%\bin\*;%OPENIDM_HOME%\framework\*;%SLF4J_API%;%SLF4J_JDK14%;%JACKSON_CORE%;%JACKSON_DATABIND%;%JACKSON_ANNOTATIONS%;%OPENIDM_SYSTEM_PATH%;%OPENIDM_UTIL_PATH%"
)
goto:eof

:error
ENDLOCAL
exit /b 1
