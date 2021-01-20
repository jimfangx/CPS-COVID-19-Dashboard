$(function () {
    if (window.innerWidth <= 800 && window.innerHeight <= 900) { // mobile detection
        $('#dashboard').attr('src', "https://public.tableau.com/views/CPSCOVID-19/TotalsMobile?:showVizHome=no&:embed=true")
    }
    $('#dashboard').attr('height', window.innerHeight - 74.5) //52.3 = "current dashboard" height
});

$('select').on('change', function () {
    if (this.value === 'total') {
        if (window.innerWidth <= 800 && window.innerHeight <= 900) { // mobile detection
            $('#dashboard').attr('src', "https://public.tableau.com/views/CPSCOVID-19/TotalsMobile?:showVizHome=no&:embed=true")
        } else {
            $('#dashboard').attr('src', "https://public.tableau.com/views/CPSCOVID-19/Totals?:showVizHome=no&:embed=true")
        }
    } else if (this.value === 'staff') {
        if (window.innerWidth <= 800 && window.innerHeight <= 900) { // mobile detection
            $('#dashboard').attr('src', "https://public.tableau.com/views/CPSCOVID-19/StaffMobile?:showVizHome=no&:embed=true")
        } else {
            $('#dashboard').attr('src', "https://public.tableau.com/views/CPSCOVID-19/Staff?:showVizHome=no&:embed=true")
        }
    } else if (this.value === 'student') {
        if (window.innerWidth <= 800 && window.innerHeight <= 900) { // mobile detection
            $('#dashboard').attr('src', "https://public.tableau.com/views/CPSCOVID-19/StudentMobile?:showVizHome=no&:embed=true")
        } else {
            $('#dashboard').attr('src', "https://public.tableau.com/views/CPSCOVID-19/Students?:showVizHome=no&:embed=true")
        }
    }
})