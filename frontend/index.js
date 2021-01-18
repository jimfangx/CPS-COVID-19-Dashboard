$(function () {
    $('#dashboard').attr('height', window.innerHeight - 74.5) //52.3 = "current dashboard" height
});

$('select').on('change', function () {
    if (this.value === 'total') {
        $('#dashboard').attr('src', "https://public.tableau.com/views/CPSCOVID-19/Totals?:showVizHome=no&:embed=true")
        
    } else if (this.value === 'staff') {
        $('#dashboard').attr('src', "https://public.tableau.com/views/CPSCOVID-19/Staff?:showVizHome=no&:embed=true")
    } else if (this.value === 'student') {
        $('#dashboard').attr('src', "https://public.tableau.com/views/CPSCOVID-19/Students?:showVizHome=no&:embed=true")

    }
})